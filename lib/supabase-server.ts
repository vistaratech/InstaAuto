import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Manually load env variables if running in server environments where process.env might not be fully loaded
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const parts = trimmedLine.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          let value = parts.slice(1).join('=').trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL;

// Module-level connection pool (shared across all queries, max 10 connections)
const pool = connectionString ? new Pool({ connectionString, max: 10 }) : null;

class NeonQueryBuilder {
  private tableName: string;
  private action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' = 'SELECT';
  private fields: string = '*';
  private insertData: any = null;
  private updateData: any = null;
  private upsertData: any = null;
  private onConflictCol: string | null = null;
  private filters: { col: string; op: string; val: any }[] = [];
  private orFilters: string | null = null;
  private orderByCol: string | null = null;
  private orderAscending: boolean = true;
  private limitValue: number | null = null;
  private isSingle: boolean = false;
  private countOption: string | null = null;
  private isHead: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    if (this.action === 'INSERT' || this.action === 'UPDATE' || this.action === 'DELETE') {
      // Supabase's post-mutation select chain (e.g. .insert().select()), ignore action override
      return this;
    }
    this.action = 'SELECT';
    this.fields = fields;
    if (options?.count) {
      this.countOption = options.count;
    }
    if (options?.head) {
      this.isHead = options.head;
    }
    return this;
  }

  insert(data: any) {
    this.action = 'INSERT';
    this.insertData = data;
    return this;
  }

  upsert(data: any, options?: { onConflict?: string }) {
    this.action = 'INSERT';
    this.upsertData = data;
    if (options?.onConflict) {
      this.onConflictCol = options.onConflict;
    }
    return this;
  }

  update(data: any) {
    this.action = 'UPDATE';
    this.updateData = data;
    return this;
  }

  delete() {
    this.action = 'DELETE';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ col: column, op: '=', val: value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ col: column, op: '<>', val: value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ col: column, op: '>=', val: value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ col: column, op: '<=', val: value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByCol = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(val: number) {
    this.limitValue = val;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  or(filterString: string) {
    this.orFilters = filterString;
    return this;
  }

  // Handle Thenable for async/await support
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    if (!pool) {
      return { data: null, error: new Error('DATABASE_URL is not set in environment variables.'), count: null };
    }

    const client = await pool.connect();
    
    try {

      let queryText = '';
      const queryValues: any[] = [];
      let paramCounter = 1;

      // Special handling for the only complex join select used in dashboard stats
      if (this.action === 'SELECT' && this.fields.includes('recipient:conversations(recipient_username)')) {
        queryText = `
          SELECT 
            messages.id, 
            messages.content, 
            messages.created_at, 
            messages.sender_username, 
            messages.conversation_id, 
            conversations.recipient_username AS recipient_username 
          FROM messages 
          LEFT JOIN conversations ON messages.conversation_id = conversations.id
        `;
        
        if (this.filters.length > 0) {
          const filterClauses = this.filters.map(f => {
            const tablePrefix = (f.col === 'user_id' || f.col === 'is_from_instagram') ? 'messages.' : '';
            queryValues.push(f.val);
            return `${tablePrefix}${f.col} = $${paramCounter++}`;
          });
          queryText += ` WHERE ${filterClauses.join(' AND ')}`;
        }
      } else {
        // Standard CRUD operations
        if (this.action === 'SELECT') {
          queryText = `SELECT ${this.fields} FROM ${this.tableName}`;
        } else if (this.action === 'INSERT') {
          const isUpsert = this.upsertData !== null;
          const rows = isUpsert 
            ? (Array.isArray(this.upsertData) ? this.upsertData : [this.upsertData])
            : (Array.isArray(this.insertData) ? this.insertData : [this.insertData]);
          const columns = Object.keys(rows[0]);
          const valueGroups = [];

          for (const row of rows) {
            const group = [];
            for (const col of columns) {
              let val = row[col];
              if (val !== null && typeof val === 'object') {
                val = JSON.stringify(val);
              }
              queryValues.push(val);
              group.push(`$${paramCounter++}`);
            }
            valueGroups.push(`(${group.join(', ')})`);
          }

          queryText = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES ${valueGroups.join(', ')}`;
          
          if (isUpsert && this.onConflictCol) {
            const updates = columns
              .filter(col => col !== this.onConflictCol)
              .map(col => `${col} = EXCLUDED.${col}`);
            queryText += ` ON CONFLICT (${this.onConflictCol}) DO UPDATE SET ${updates.join(', ')}`;
          }
          
          queryText += ` RETURNING *`;
        } else if (this.action === 'UPDATE') {
          const sets = [];
          for (const [col, val] of Object.entries(this.updateData)) {
            let formattedVal = val;
            if (formattedVal !== null && typeof formattedVal === 'object') {
              formattedVal = JSON.stringify(formattedVal);
            }
            queryValues.push(formattedVal);
            sets.push(`${col} = $${paramCounter++}`);
          }
          queryText = `UPDATE ${this.tableName} SET ${sets.join(', ')}`;
        } else if (this.action === 'DELETE') {
          queryText = `DELETE FROM ${this.tableName}`;
        }

        // Apply filters (AND conditions + OR groups)
        {
          const whereParts: string[] = [];

          if (this.filters.length > 0) {
            const filterClauses = this.filters.map(f => {
              let op = f.op;
              if (f.val === null) {
                if (op === '=') return `${f.col} IS NULL`;
                if (op === '<>') return `${f.col} IS NOT NULL`;
              }
              queryValues.push(f.val);
              return `${f.col} ${op} $${paramCounter++}`;
            });
            whereParts.push(...filterClauses);
          }

          if (this.orFilters) {
            const orParts = this.orFilters.split(',').map(part => {
              const dotParts = part.trim().split('.');
              const col = dotParts[0];
              const op = dotParts[1];
              const val = dotParts.slice(2).join('.');
              const sqlOp = op === 'eq' ? '=' : op === 'neq' ? '<>' : op === 'gte' ? '>=' : op === 'lte' ? '<=' : '=';
              queryValues.push(val);
              return `${col} ${sqlOp} $${paramCounter++}`;
            });
            whereParts.push(`(${orParts.join(' OR ')})`);
          }

          if (whereParts.length > 0) {
            queryText += ` WHERE ${whereParts.join(' AND ')}`;
          }
        }
      }

      // Add returning clause to update and delete if not present
      if ((this.action === 'UPDATE' || this.action === 'DELETE') && !queryText.includes('RETURNING')) {
        queryText += ' RETURNING *';
      }

      if (this.orderByCol) {
        queryText += ` ORDER BY ${this.orderByCol} ${this.orderAscending ? 'ASC' : 'DESC'}`;
      }

      if (this.limitValue !== null) {
        queryText += ` LIMIT ${this.limitValue}`;
      }

      const res = await client.query(queryText, queryValues);
      
      let data: any = res.rows;
      let count: number | null = null;

      if (this.countOption === 'exact') {
        count = res.rowCount;
      }

      if (this.isHead) {
        data = null;
      } else if (this.fields.includes('recipient:conversations(recipient_username)')) {
        data = res.rows.map(row => ({
          id: row.id,
          content: row.content,
          created_at: row.created_at,
          sender_username: row.sender_username,
          conversation_id: row.conversation_id,
          recipient: {
            recipient_username: row.recipient_username
          }
        }));
      } else if (this.action === 'INSERT' && !Array.isArray(this.upsertData || this.insertData)) {
        data = res.rows[0] || null;
      } else if (this.isSingle) {
        data = res.rows[0] || null;
      }

      return { data, error: null, count };
    } catch (err: any) {
      console.error(`[Neon Client Error] Query failed on table ${this.tableName}: ${err.message}`);
      return { data: null, error: err, count: null };
    } finally {
      client.release();
    }
  }
}

export async function getSupabaseServerClient() {
  return {
    from: (tableName: string) => new NeonQueryBuilder(tableName)
  };
}
