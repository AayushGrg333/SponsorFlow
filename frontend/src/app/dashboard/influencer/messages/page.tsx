"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ImageIcon, Smile, Check, CheckCheck } from "lucide-react"
import useSWR from "swr"

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MessagesPage() {
  const { data: conversations, error: conversationsError } = useSWR("/api/messages/conversations", fetcher)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const { data: messages, mutate: mutateMessages } = useSWR(
    selectedConversationId ? `/api/messages/${selectedConversationId}` : null,
    fetcher,
  )

  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversationId) return

    try {
      await fetch(`/api/messages/${selectedConversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })
      mutateMessages()
      setNewMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const selectedConversation = conversations?.find((c: any) => c.id === selectedConversationId) || conversations?.[0]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="flex h-[calc(100vh-0px)] flex-col pt-16 lg:pt-0">
          {/* Header - Hidden on mobile when in chat view */}
          <div className={cn("border-b border-border px-4 py-4 lg:px-8", !showConversations && "hidden lg:block")}>
            <DashboardHeader title="Messages" subtitle="Chat with brands about collaborations" />
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full flex-col border-r border-border lg:flex lg:w-80",
                showConversations ? "flex" : "hidden",
              )}
            >
              {/* Search */}
              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations?.map((conversation: any) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversationId(conversation.id)
                      setShowConversations(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/50",
                      selectedConversationId === conversation.id && "bg-secondary",
                    )}
                  >
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs">{conversation.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={cn("flex flex-1 flex-col", showConversations ? "hidden lg:flex" : "flex")}>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowConversations(true)}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <div className="relative">
                    <img
                      src={selectedConversation?.avatar || "/placeholder.svg"}
                      alt={selectedConversation?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {selectedConversation?.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedConversation?.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation?.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message: any) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-xs",
                          message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        <span>{message.time}</span>
                        {message.sender === "me" &&
                          (message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
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
                  <Button size="icon" onClick={handleSend}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
