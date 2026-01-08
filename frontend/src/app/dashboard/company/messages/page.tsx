"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, Send, Paperclip, MoreVertical, ImageIcon, Smile, Check, CheckCheck } from "lucide-react"
import { messagesAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper" // Make sure this path is correct
import { initSocket, sendMessage, onReceiveMessage, markAsRead, disconnectSocket } from "@/lib/socket"

interface Message {
  _id: string
  senderId: string
  receiverId: string
  senderType: string
  receiverType: string
  content: string
  isRead: boolean
  createdAt: string
  conversationId: string
}

interface Conversation {
  _id: string
  participants: Array<{
    id: string
    model: string
    name?: string
    avatar?: string
  }>
  lastMessage?: {
    content: string
    createdAt: string
  }
  unreadCount?: number
}

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [loading, setLoading] = useState(true)
  const [socketConnected, setSocketConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    
    if (storedUser) {
      console.log("👤 User loaded:", storedUser.id, storedUser.role)
      
      // Initialize socket
      const socket = initSocket(storedUser.id, storedUser.role)
      
      if (socket) {
        setSocketConnected(true)
        console.log("🔌 Socket initialized")
        
        // Load conversations
        loadConversations()
        
        // Listen for new messages
        const cleanup = onReceiveMessage((newMsg: any) => {
          handleNewMessage(newMsg)
        })
        
        return () => {
          cleanup()
          disconnectSocket()
        }
      } else {
        console.error("❌ Failed to initialize socket - no token found")
      }
    } else {
      console.error("❌ No user found in storage")
    }
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      console.log("📥 Loading conversations...")
      const response = await messagesAPI.getConversations()
      const data = (response.data as { data: Conversation[] }).data
      if (data && !response.error) {
        console.log("✅ Loaded conversations:", data.length)
        setConversations(data)
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0])
        }
      } else {
        console.error("❌ Error loading conversations:", response.error)
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      console.log("📥 Loading messages for conversation:", conversationId)
      const response = await messagesAPI.getMessages(conversationId)
      if (response.data && !response.error) {
        const msgs = response.data as Message[]
        console.log("✅ Loaded messages:", msgs.length)
        setMessages(msgs)
        
        // Mark unread messages as read
        msgs
          .filter(msg => msg.receiverId === user?.id && !msg.isRead)
          .forEach(msg => {
            console.log("📖 Marking message as read:", msg._id)
            markAsRead(msg._id)
          })
      } else {
        console.error("❌ Error loading messages:", response.error)
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error)
    }
  }

  const handleNewMessage = (newMsg: any) => {
    console.log("📨 New message received:", newMsg)
    if (Array.isArray(newMsg)) {
      // Handle array of messages (unread messages on connect)
      setMessages(prev => [...prev, ...newMsg])
    } else {
      // Handle single message
      setMessages(prev => [...prev, newMsg])
      
      // Mark as read if conversation is selected
      if (selectedConversation?._id === newMsg.conversationId && newMsg.receiverId === user?.id) {
        markAsRead(newMsg._id)
      }
      
      // Reload conversations to update last message
      loadConversations()
    }
  }

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const receiver = selectedConversation.participants.find(p => p.id !== user.id)
    if (!receiver) return

    console.log("📤 Sending message to:", receiver.id)
    
    sendMessage({
      senderId: user.id,
      senderType: user.role,
      receiverId: receiver.id,
      receiverType: receiver.model as "influencer" | "company",
      content: newMessage,
    })

    setNewMessage("")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p.id !== user?.id)
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 86400000) { // Less than 24 hours
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const otherUser = selectedConversation ? getOtherParticipant(selectedConversation) : null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user?.role || "company"} />

      <main className="lg:pl-64">
        <div className="flex h-[calc(100vh-0px)] flex-col pt-16 lg:pt-0">
          <div className={cn("border-b border-border px-4 py-4 lg:px-8", !showConversations && "hidden lg:block")}>
            <DashboardHeader title="Messages" subtitle="Chat with influencers about collaborations" />
            {/* Socket Status Indicator */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className={cn(
                "h-2 w-2 rounded-full",
                socketConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-muted-foreground">
                {socketConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full flex-col border-r border-border lg:flex lg:w-80",
                showConversations ? "flex" : "hidden",
              )}
            >
              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const other = getOtherParticipant(conversation)
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => {
                          setSelectedConversation(conversation)
                          setShowConversations(false)
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/50",
                          selectedConversation?._id === conversation._id && "bg-secondary",
                        )}
                      >
                        <div className="relative">
                          <img
                            src={other?.avatar || "/placeholder.svg"}
                            alt={other?.name || "User"}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-foreground truncate">{other?.name || "Unknown"}</h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full bg-accent p-0 text-xs text-accent-foreground">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={cn("flex flex-1 flex-col", showConversations ? "hidden lg:flex" : "flex")}>
              {selectedConversation ? (
                <>
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setShowConversations(true)}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Button>
                      <div className="relative">
                        <img
                          src={otherUser?.avatar || "/placeholder.svg"}
                          alt={otherUser?.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{otherUser?.name || "Unknown"}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{otherUser?.model || "User"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages
                      .filter(msg => msg.conversationId === selectedConversation._id)
                      .map((message) => (
                        <div
                          key={message._id}
                          className={cn("flex", message.senderId === user?.id ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2",
                              message.senderId === user?.id
                                ? "bg-accent text-accent-foreground"
                                : "bg-secondary text-foreground",
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={cn(
                                "mt-1 flex items-center justify-end gap-1 text-xs",
                                message.senderId === user?.id
                                  ? "text-accent-foreground/70"
                                  : "text-muted-foreground",
                              )}
                            >
                              <span>{formatTime(message.createdAt)}</span>
                              {message.senderId === user?.id &&
                                (message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-border p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      />
                      <Button variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button size="icon" className="bg-accent hover:bg-accent/90" onClick={handleSend}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}