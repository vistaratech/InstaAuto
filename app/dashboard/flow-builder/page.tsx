"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Play, 
  MessageSquare, 
  Clock, 
  Zap, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  Info,
  Sliders,
  Maximize2,
  Compass,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Node {
  id: string
  type: "trigger" | "message" | "delay" | "action"
  x: number
  y: number
  title: string
  content: string
  extra?: string
}

interface Connection {
  id: string
  fromId: string
  toId: string
}

export default function FlowBuilderPage() {
  // Initial demo nodes
  const [nodes, setNodes] = useState<Node[]>([
    { 
      id: "1", 
      type: "trigger", 
      x: 80, 
      y: 180, 
      title: "Keyword Trigger", 
      content: "start", 
      extra: "Trigger keyword" 
    },
    { 
      id: "2", 
      type: "message", 
      x: 420, 
      y: 80, 
      title: "Welcome DM", 
      content: "Hey machan! Welcome to DMSpark! Smart automations are now active on your profile. 🚀", 
      extra: "Auto-reply text" 
    },
    { 
      id: "3", 
      type: "delay", 
      x: 420, 
      y: 280, 
      title: "Smart Delay", 
      content: "5", 
      extra: "seconds" 
    },
    { 
      id: "4", 
      type: "action", 
      x: 760, 
      y: 280, 
      title: "Add Lead Tag", 
      content: "Potential Client", 
      extra: "SaaS CRM Tag" 
    }
  ])

  // Initial connections
  const [connections, setConnections] = useState<Connection[]>([
    { id: "c1", fromId: "1", toId: "2" },
    { id: "c2", fromId: "1", toId: "3" },
    { id: "c3", fromId: "3", toId: "4" }
  ])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("1")
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isSaved, setIsSaved] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Find selected node
  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  // Handle Drag Start
  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === id)
    if (!node) return
    setDraggedNodeId(id)
    setSelectedNodeId(id)
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    })
  }

  // Handle Drag Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId) return
    e.preventDefault()

    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === draggedNodeId) {
          // Clamp coordinates to keep inside canvas boundaries
          const newX = Math.max(20, Math.min(e.clientX - dragOffset.x, 1200))
          const newY = Math.max(20, Math.min(e.clientY - dragOffset.y, 650))
          return { ...node, x: newX, y: newY }
        }
        return node
      })
    )
  }

  // Handle Drag End
  const handleMouseUp = () => {
    setDraggedNodeId(null)
  }

  // Add new Node
  const addNewNode = (type: "message" | "delay" | "action") => {
    const id = (nodes.length + 1).toString()
    let title = ""
    let content = ""
    let extra = ""

    if (type === "message") {
      title = "New Reply"
      content = "Type your Instagram response message here..."
      extra = "Auto-reply text"
    } else if (type === "delay") {
      title = "Wait Delay"
      content = "10"
      extra = "seconds"
    } else {
      title = "Assign Tag"
      content = "Warm Lead"
      extra = "SaaS CRM Tag"
    }

    const newNode: Node = {
      id,
      type,
      x: 300 + Math.random() * 80,
      y: 200 + Math.random() * 80,
      title,
      content,
      extra
    }

    setNodes([...nodes, newNode])
    setSelectedNodeId(id)

    // Try to auto-connect from selected node if exists
    if (selectedNodeId) {
      setConnections(prev => [...prev, {
        id: `c_${Date.now()}`,
        fromId: selectedNodeId,
        toId: id
      }])
    }
  }

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId))
    setConnections(prev => prev.filter(c => c.fromId !== selectedNodeId && c.toId !== selectedNodeId))
    setSelectedNodeId(null)
  }

  // Update selected node values from right sidebar
  const updateSelectedNode = (field: "title" | "content" | "extra", value: string) => {
    if (!selectedNodeId) return
    setNodes(prev => prev.map(node => {
      if (node.id === selectedNodeId) {
        return { ...node, [field]: value }
      }
      return node
    }))
  }

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-foreground min-h-[90vh] flex flex-col justify-between font-sans">
      {/* Top Header Utilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visual Flow Builder</h1>
          <p className="text-muted-foreground mt-1">Design and map your Instagram DM conversational flows visually.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10 transition-all"
          >
            <Save className="w-4 h-4" /> {isSaved ? "Flow Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Builder Layout Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch relative min-h-[580px]">
        
        {/* Left Side Visual Drag & Drop Canvas */}
        <div 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-3 border border-border bg-card/40 backdrop-blur-sm rounded-3xl relative overflow-hidden select-none min-h-[500px] shadow-sm flex flex-col justify-between"
        >
          {/* Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          {/* Floating Canvas Dock / Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between bg-card/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border shadow-sm flex-wrap gap-3">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Compass className="w-4 h-4 text-primary animate-pulse" /> Flow Dock
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => addNewNode("message")}
                size="sm"
                variant="outline"
                className="h-8 rounded-xl text-xs font-semibold hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all cursor-pointer flex items-center gap-1 bg-transparent"
              >
                <Plus className="w-3.5 h-3.5" /> Message
              </Button>
              <Button
                onClick={() => addNewNode("delay")}
                size="sm"
                variant="outline"
                className="h-8 rounded-xl text-xs font-semibold hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-all cursor-pointer flex items-center gap-1 bg-transparent"
              >
                <Plus className="w-3.5 h-3.5" /> Delay
              </Button>
              <Button
                onClick={() => addNewNode("action")}
                size="sm"
                variant="outline"
                className="h-8 rounded-xl text-xs font-semibold hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/30 transition-all cursor-pointer flex items-center gap-1 bg-transparent"
              >
                <Plus className="w-3.5 h-3.5" /> Action
              </Button>
            </div>
          </div>

          {/* SVG Connections Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.58 0.16 260)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="oklch(0.68 0.18 280)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            {connections.map(c => {
              const fromNode = nodes.find(n => n.id === c.fromId)
              const toNode = nodes.find(n => n.id === c.toId)
              if (!fromNode || !toNode) return null

              // Calculate ports (fromNode right edge center, toNode left edge center)
              const startX = fromNode.x + 200 // node width is 200
              const startY = fromNode.y + 40  // node header height center
              const endX = toNode.x
              const endY = toNode.y + 40

              // Draw bezier curves
              const controlOffset = Math.abs(endX - startX) * 0.4
              const pathD = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`

              return (
                <g key={c.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={4}
                    opacity={0.3}
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#wireGradient)"
                    strokeWidth={2.5}
                    className="transition-all"
                  />
                  {/* Floating pulse circle along path */}
                  <circle r={3.5} fill="oklch(0.58 0.16 260)">
                    <animateMotion
                      dur="3.5s"
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          {/* Render Draggable Nodes */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id
              let typeStyles = ""
              let iconElement = null

              if (node.type === "trigger") {
                typeStyles = "border-emerald-500/30 shadow-emerald-500/5 bg-emerald-500/5"
                iconElement = <Zap className="w-3.5 h-3.5 text-emerald-500" />
              } else if (node.type === "message") {
                typeStyles = "border-blue-500/30 shadow-blue-500/5 bg-blue-500/5"
                iconElement = <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              } else if (node.type === "delay") {
                typeStyles = "border-amber-500/30 shadow-amber-500/5 bg-amber-500/5"
                iconElement = <Clock className="w-3.5 h-3.5 text-amber-500" />
              } else if (node.type === "action") {
                typeStyles = "border-purple-500/30 shadow-purple-500/5 bg-purple-500/5"
                iconElement = <Sliders className="w-3.5 h-3.5 text-purple-500" />
              }

              return (
                <div
                  key={node.id}
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id) }}
                  className={`absolute w-[200px] bg-card rounded-2xl border ${isSelected ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border'} shadow-sm transition-shadow duration-200 cursor-pointer overflow-hidden ${typeStyles}`}
                >
                  {/* Node Header (Drag Target) */}
                  <div
                    onMouseDown={(e) => handleDragStart(e, node.id)}
                    className="px-3.5 py-2.5 border-b border-border/80 flex items-center justify-between select-none cursor-grab active:cursor-grabbing bg-secondary/30"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {iconElement}
                      <span className="text-[10px] font-black tracking-tight text-foreground truncate uppercase">{node.title}</span>
                    </div>
                  </div>

                  {/* Node Content */}
                  <div className="p-3">
                    <p className="text-[11px] text-muted-foreground leading-normal line-clamp-3 font-medium italic">
                      "{node.content}"
                    </p>
                    {node.extra && (
                      <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider block mt-2 text-right">
                        {node.extra}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 z-30 pointer-events-none text-[10px] text-muted-foreground font-semibold uppercase tracking-widest block opacity-75">
            DMSpark Flow Workspace 1.0
          </div>
        </div>

        {/* Right Side Glassmorphic Configurer Panel */}
        <Card className="lg:col-span-1 p-5 bg-card/60 border-border shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-extrabold text-foreground text-sm tracking-tight border-b border-border/50 pb-2.5 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Node Properties
            </h3>

            {selectedNode ? (
              <div className="space-y-4">
                {/* Node Title input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Node Label</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => updateSelectedNode("title", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Node Content text area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
                    {selectedNode.type === "trigger" ? "Trigger Word" : selectedNode.type === "delay" ? "Delay Time (seconds)" : "Message / Tag Content"}
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.content}
                    onChange={(e) => updateSelectedNode("content", e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/60 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Optional description label */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Subtext Label</label>
                  <input
                    type="text"
                    value={selectedNode.extra || ""}
                    onChange={(e) => updateSelectedNode("extra", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                {/* Node details alert info */}
                <div className="bg-secondary/40 border border-border p-3 rounded-xl flex gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">Node Guide</p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      This {selectedNode.type} node triggers when {selectedNode.type === 'trigger' ? `the keyword matches "${selectedNode.content}".` : `the flow reaches this conversation point.`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-muted-foreground text-xs border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2">
                <Maximize2 className="w-5 h-5 opacity-40 animate-pulse" />
                <span>Select a node inside the canvas to edit its properties.</span>
              </div>
            )}
          </div>

          {/* Delete Node Container */}
          {selectedNodeId && selectedNode?.type !== "trigger" && (
            <div className="pt-4 border-t border-border mt-6">
              <Button
                onClick={deleteSelectedNode}
                variant="ghost"
                className="w-full h-10 rounded-xl hover:bg-destructive/10 text-destructive hover:text-destructive font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected Node
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
