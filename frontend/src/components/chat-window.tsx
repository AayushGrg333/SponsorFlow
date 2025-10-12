"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Phone, Video, Paperclip, Send, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Conversation, Message } from "@/types/chat"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatWindow({ conversation, messages, onSendMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
              <AvatarFallback>
                {conversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {conversation.online && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--online-status)] border-2 border-card" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{conversation.name}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.role} • {conversation.company}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => {
          const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
          const showTimestamp = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId

          return (
            <div key={message.id} className={cn("flex gap-3", message.isOwn ? "justify-end" : "justify-start")}>
              {!message.isOwn && (
                <div className="w-8">
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div className={cn("flex flex-col gap-1", message.isOwn ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 max-w-md break-words",
                    message.isOwn
                      ? "bg-[var(--message-sent)] text-[var(--message-sent-foreground)] rounded-br-sm"
                      : "bg-[var(--message-received)] text-[var(--message-received-foreground)] rounded-bl-sm",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {showTimestamp && (
                  <span className="text-xs text-muted-foreground px-1">{formatTime(message.timestamp)}</span>
                )}
              </div>

              {message.isOwn && <div className="w-8" />}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="pr-10 bg-input border-0 rounded-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
