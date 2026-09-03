"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, X, Loader2, MessageCircle, Send, Tag, Check, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { Automation } from "@/lib/types"

interface EditRuleModalProps {
  rule: Automation | null
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export function EditRuleModal({ rule, userId, onClose, onSuccess }: EditRuleModalProps) {
  const [name, setName] = useState("")
  const [keywordsInput, setKeywordsInput] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isCard, setIsCard] = useState(false)
  const [cardTitle, setCardTitle] = useState("")
  const [cardSubtitle, setCardSubtitle] = useState("")
  const [cardImageUrl, setCardImageUrl] = useState("")
  const [cardButtonTitle, setCardButtonTitle] = useState("")
  const [cardButtonUrl, setCardButtonUrl] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!rule) return

    setName(rule.name || "")
    setKeywordsInput(rule.trigger_value || "")

    const content = rule.response_content || {}
    if (content.card) {
      setIsCard(true)
      setCardTitle(content.card.title || "")
      setCardSubtitle(content.card.subtitle || "")
      setCardImageUrl(content.card.image_url || "")
      const firstBtn = content.card.buttons?.[0]
      setCardButtonTitle(firstBtn?.title || "")
      setCardButtonUrl(firstBtn?.url || "")
      setMessageText(content.message || "")
    } else {
      setIsCard(false)
      setMessageText(content.message || "")
    }
  }, [rule])

  if (!rule) return null

  // Parse keywords for live badge preview
  const parsedKeywords = keywordsInput
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name Required", { description: "Please enter an automation name." })
      return
    }

    if (!keywordsInput.trim()) {
      toast.error("Keywords Required", { description: "Enter at least one trigger keyword." })
      return
    }

    if (!isCard && !messageText.trim()) {
      toast.error("Message Required", { description: "Please enter the reply message." })
      return
    }

    if (isCard && !cardTitle.trim()) {
      toast.error("Card Title Required", { description: "Cards require a title." })
      return
    }

    setSaving(true)

    // Build updated content object
    const updatedContent: any = {
      ...(rule.response_content || {}),
    }

    if (isCard) {
      const updatedButtons = []
      if (cardButtonTitle.trim()) {
        let cleanUrl = cardButtonUrl.trim()
        if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
          cleanUrl = `https://${cleanUrl}`
        }
        updatedButtons.push({
          type: "web_url",
          title: cardButtonTitle.trim(),
          url: cleanUrl || undefined,
        })
      }

      updatedContent.card = {
        title: cardTitle.trim(),
        subtitle: cardSubtitle.trim() || undefined,
        image_url: cardImageUrl.trim() || undefined,
        buttons: updatedButtons,
      }
      if (messageText.trim()) {
        updatedContent.message = messageText.trim()
      }
    } else {
      updatedContent.message = messageText.trim()
    }

    try {
      const res = await fetch("/api/automations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rule.id,
          userId,
          name: name.trim(),
          trigger_source: rule.trigger_source,
          trigger_type: rule.trigger_type,
          trigger_value: keywordsInput.trim().toLowerCase(),
          content: updatedContent,
          specific_media_id: rule.specific_media_id || null,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update automation")
      }

      toast.success("Automation Updated! ✨", {
        description: `Keywords & reply message saved for "${name}".`,
      })
      onSuccess()
    } catch (err: any) {
      console.error("[EditRuleModal] Save failed:", err)
      toast.error("Save Failed", { description: err.message || "Could not update automation." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border/70 flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Edit Automation</h3>
              <p className="text-xs text-muted-foreground">
                Update keywords and automated message reply
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 hover-scrollbar">
          
          {/* 1. Automation Name */}
          <div className="space-y-1.5">
            <Label htmlFor="rule-name" className="text-xs font-bold text-foreground">
              Automation Name
            </Label>
            <Input
              id="rule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Price Inquiry → Auto Reply"
              className="bg-background text-sm rounded-xl border-border"
            />
          </div>

          {/* 2. Trigger Keywords */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="keywords" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Trigger Keywords
              </Label>
              <span className="text-[10px] text-muted-foreground font-medium">Comma separated</span>
            </div>
            
            <Input
              id="keywords"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="e.g. link, price, info, send"
              className="bg-background text-sm font-mono rounded-xl border-border"
            />

            {/* Keyword Chips Preview */}
            {parsedKeywords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Active:</span>
                {parsedKeywords.map((kw, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/20 text-xs font-mono px-2 py-0.5"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When a follower sends any of these keywords in a DM or Comment, this automation will fire instantly.
            </p>
          </div>

          {/* 3. Reply Message (DM Text) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-text" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> Automated Direct Message (DM)
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">{messageText.length} chars</span>
            </div>
            
            <Textarea
              id="message-text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write the message that will be sent to the user..."
              rows={4}
              className="bg-background text-sm rounded-xl border-border resize-none leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground">
              Tip: You can include links (e.g. https://yourwebsite.com) or coupon codes directly in the message.
            </p>
          </div>

          {/* 4. Rich Card Fields (Only if this rule uses a Card template) */}
          {isCard && (
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Send className="w-3.5 h-3.5 text-blue-500" /> Rich Card Settings
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Card Title</Label>
                <Input
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Card Title (e.g. Summer Sale 50% Off)"
                  className="bg-background text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Card Subtitle</Label>
                <Input
                  value={cardSubtitle}
                  onChange={(e) => setCardSubtitle(e.target.value)}
                  placeholder="Optional subtitle"
                  className="bg-background text-xs rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Button Text</Label>
                  <Input
                    value={cardButtonTitle}
                    onChange={(e) => setCardButtonTitle(e.target.value)}
                    placeholder="e.g. Visit Website"
                    className="bg-background text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Button URL</Label>
                  <Input
                    value={cardButtonUrl}
                    onChange={(e) => setCardButtonUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-background text-xs rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border/70 flex items-center justify-between bg-secondary/15">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}
