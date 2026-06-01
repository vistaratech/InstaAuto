"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useInstagramSession } from "@/hooks/use-instagram-session"
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
  ArrowRight,
  Loader2,
  ArrowLeft
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <FlowBuilderContent />
    </Suspense>
  )
}

function FlowBuilderContent() {
  const { userId, isLoading: isSessionLoading } = useInstagramSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const flowId = searchParams.get("id")

  // Demo fallback nodes
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

  // Demo fallback connections
  const [connections, setConnections] = useState<Connection[]>([
    { id: "c1", fromId: "1", toId: "2" },
    { id: "c2", fromId: "1", toId: "3" },
    { id: "c3", fromId: "3", toId: "4" }
  ])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("1")
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isSaved, setIsSaved] = useState(false)
  const [isLoadingFlow, setIsLoadingFlow] = useState(false)
  const [automationName, setAutomationName] = useState<string>("Demo Automation Flow")
  const [specificMediaId, setSpecificMediaId] = useState<string | null>(null)
  const [triggerSource, setTriggerSource] = useState<'comment' | 'dm' | 'story'>('dm')

  const canvasRef = useRef<HTMLDivElement>(null)

  // Find selected node
  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  // Fetch automation if flowId is set in URL query parameters
  useEffect(() => {
    if (!userId || !flowId) return

    const loadAutomation = async () => {
      try {
        setIsLoadingFlow(true)
        const res = await fetch(`/api/automations?userId=${userId}`)
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          const rule = data.find((r: any) => r.id === flowId)
          if (rule) {
            setAutomationName(rule.name)
            setSpecificMediaId(rule.specific_media_id)
            setTriggerSource(rule.trigger_source)

            // Map database rule into nodes
            const triggerNode: Node = {
              id: "trigger-node",
              type: "trigger",
              x: 80,
              y: 180,
              title: rule.trigger_source === "comment" ? "Comment Trigger" : rule.trigger_source === "story" ? "Story Trigger" : "DM Keyword Trigger",
              content: rule.trigger_value || "start",
              extra: rule.trigger_type || "keyword"
            }

            const isFollowGate = rule.response_content?.check_follow
            const delaySec = rule.response_content?.delay_seconds
            const responseMsg = rule.response_content?.message || rule.response_content?.card?.title || "Welcome to DMSpark!"
            
            const messageNode: Node = {
              id: "message-node",
              type: "message",
              x: (isFollowGate || delaySec) ? 640 : 360,
              y: 180,
              title: rule.name || "Auto-Reply Message",
              content: responseMsg,
              extra: rule.response_content?.card ? "Rich Card Reply" : "Simple Text Reply"
            }

            const newNodesList = [triggerNode, messageNode]
            const newConnectionsList: Connection[] = []

            if (isFollowGate && delaySec) {
              const followNode: Node = {
                id: "follow-check-node",
                type: "action",
                x: 360,
                y: 280,
                title: "Follower Check",
                content: "Followers Only Gate",
                extra: "Gate check active"
              }
              const delayNode: Node = {
                id: "delay-node",
                type: "delay",
                x: 360,
                y: 80,
                title: "Wait Delay",
                content: String(delaySec),
                extra: "seconds"
              }
              newNodesList.push(followNode, delayNode)
              newConnectionsList.push(
                { id: "c-t-f", fromId: "trigger-node", toId: "follow-check-node" },
                { id: "c-f-d", fromId: "follow-check-node", toId: "delay-node" },
                { id: "c-d-m", fromId: "delay-node", toId: "message-node" }
              )
            } else if (isFollowGate) {
              const followNode: Node = {
                id: "follow-check-node",
                type: "action",
                x: 360,
                y: 200,
                title: "Follower Check",
                content: "Followers Only Gate",
                extra: "Gate check active"
              }
              newNodesList.push(followNode)
              newConnectionsList.push(
                { id: "c-t-f", fromId: "trigger-node", toId: "follow-check-node" },
                { id: "c-f-m", fromId: "follow-check-node", toId: "message-node" }
              )
            } else if (delaySec) {
              const delayNode: Node = {
                id: "delay-node",
                type: "delay",
                x: 360,
                y: 200,
                title: "Wait Delay",
                content: String(delaySec),
                extra: "seconds"
              }
              newNodesList.push(delayNode)
              newConnectionsList.push(
                { id: "c-t-d", fromId: "trigger-node", toId: "delay-node" },
                { id: "c-d-m", fromId: "delay-node", toId: "message-node" }
              )
            } else {
              newConnectionsList.push(
                { id: "c-t-m", fromId: "trigger-node", toId: "message-node" }
              )
            }

            setNodes(newNodesList)
            setConnections(newConnectionsList)
            setSelectedNodeId("trigger-node")
            toast.success("Automation loaded successfully! 🚀")
          }
        }
      } catch (err) {
        console.error("Failed to load flow:", err)
        toast.error("Failed to load automation flow.")
      } finally {
        setIsLoadingFlow(false)
      }
    }

    loadAutomation()
  }, [userId, flowId])

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

  // Save changes to database API or locally
  const handleSave = async () => {
    if (isLoadingFlow) return

    // If editing a real database automation
    if (flowId && userId) {
      try {
        setIsSaved(true)
        const triggerNode = nodes.find(n => n.type === "trigger")
        if (!triggerNode) {
          toast.error("Flow invalid", { description: "Your flow must have a Trigger node." })
          setIsSaved(false)
          return
        }

        // Trace the connected nodes using a BFS path traversal to find the message node, delay seconds, and follow check status
        let connectedMessageNode: Node | null = null
        let isFollowGateActive = false
        let delaySeconds = 0

        const visited = new Set<string>()
        const queue: string[] = [triggerNode.id]

        while (queue.length > 0) {
          const currId = queue.shift()!
          if (visited.has(currId)) continue
          visited.add(currId)

          const currNode = nodes.find(n => n.id === currId)
          if (!currNode) continue

          if (currNode.type === "message") {
            connectedMessageNode = currNode
          } else if (currNode.type === "delay") {
            delaySeconds = parseInt(currNode.content) || 0
          } else if (currNode.type === "action" && currNode.title === "Follower Check") {
            isFollowGateActive = true
          }

          // Add outgoing connections
          const outgoing = connections.filter(c => c.fromId === currId)
          for (const c of outgoing) {
            if (!visited.has(c.toId)) {
              queue.push(c.toId)
            }
          }
        }

        // Fallback: If no connected message node is traced, fallback to the first message node
        if (!connectedMessageNode) {
          connectedMessageNode = nodes.find(n => n.type === "message") || null
        }

        if (!connectedMessageNode) {
          toast.error("Flow invalid", { description: "Needs at least one Reply Message connected to your trigger." })
          setIsSaved(false)
          return
        }

        const triggerValue = triggerNode.content
        const replyText = connectedMessageNode.content

        const res = await fetch("/api/automations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: flowId,
            name: automationName,
            trigger_source: triggerSource,
            trigger_value: triggerValue,
            content: {
              message: replyText,
              check_follow: isFollowGateActive,
              delay_seconds: delaySeconds
            },
            specific_media_id: specificMediaId
          })
        })

        if (res.ok) {
          toast.success("Changes saved successfully! 🎉", { description: "Your live Instagram automation was updated." })
          setTimeout(() => router.push("/dashboard/automations"), 1200)
        } else {
          toast.error("Failed to save changes", { description: "Please check your database connectivity." })
        }
      } catch (err) {
        console.error("Save error:", err)
        toast.error("Network Error", { description: "Unable to reach server API." })
      } finally {
        setTimeout(() => setIsSaved(false), 2000)
      }
    } else {
      // Prototype visual local save feedback
      setIsSaved(true)
      toast.success("Prototype Flow saved locally! 👍", { description: "Visual map changes stored in browser view state." })
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  if (isSessionLoading || isLoadingFlow) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Loading Automation Canvas...</span>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-foreground min-h-[90vh] flex flex-col justify-between font-sans">
      {/* Top Header Utilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            {flowId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/automations")}
                className="h-8 w-8 hover:bg-secondary rounded-xl text-muted-foreground mr-1"
                title="Back to Automations"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-3xl font-bold tracking-tight">
              {flowId ? `Edit: ${automationName}` : "Visual Flow Builder"}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {flowId ? `Updating live rule: ${automationName} (${triggerSource} channel)` : "Design and map your Instagram DM conversational flows visually."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave}
            disabled={isSaved}
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
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between bg-card/85 backdrop-blur-lg px-4 py-3 rounded-2xl border border-border/80 shadow-md shadow-black/5 flex-wrap gap-3">
            <span className="text-xs font-extrabold text-foreground flex items-center gap-2 bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 px-3 py-1 rounded-full shadow-sm">
              <Compass className="w-4 h-4 text-primary animate-pulse" /> 
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Flow Dock</span>
            </span>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                onClick={() => addNewNode("message")}
                size="sm"
                variant="outline"
                className="h-9 rounded-xl text-xs font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 border-blue-500/25 text-blue-500 transition-all duration-300 cursor-pointer flex items-center gap-1.5 bg-blue-500/5 shadow-sm shadow-blue-500/5 hover:shadow-blue-500/15"
              >
                <Plus className="w-3.5 h-3.5" /> Message
              </Button>
              <Button
                onClick={() => addNewNode("delay")}
                size="sm"
                variant="outline"
                className="h-9 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-white hover:border-amber-500 border-amber-500/25 text-amber-500 transition-all duration-300 cursor-pointer flex items-center gap-1.5 bg-amber-500/5 shadow-sm shadow-amber-500/5 hover:shadow-amber-500/15"
              >
                <Plus className="w-3.5 h-3.5" /> Delay
              </Button>
              <Button
                onClick={() => addNewNode("action")}
                size="sm"
                variant="outline"
                className="h-9 rounded-xl text-xs font-bold hover:bg-purple-500 hover:text-white hover:border-purple-500 border-purple-500/25 text-purple-500 transition-all duration-300 cursor-pointer flex items-center gap-1.5 bg-purple-500/5 shadow-sm shadow-purple-500/5 hover:shadow-purple-500/15"
              >
                <Plus className="w-3.5 h-3.5" /> Action
              </Button>
            </div>
          </div>

          {/* SVG Connections Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
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
                    {selectedNode.type === "trigger" ? "Trigger Word / Keywords" : selectedNode.type === "delay" ? "Delay Time (seconds)" : "Message / Tag Content"}
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
          {selectedNodeId && selectedNode?.type !== "trigger" && selectedNode?.id !== "message-node" && (
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
