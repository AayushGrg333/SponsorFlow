"use client"

import { useState } from "react"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import type { Conversation, Message } from "@/types/chat"

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Brand Manager",
    company: "TechCorp Inc.",
    avatar: "/professional-woman-diverse.png",
    lastMessage: "Looking forward to the collaboration!",
    timestamp: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "Fashion Forward",
    avatar: "/professional-man.jpg",
    lastMessage: "Can we schedule a call next week?",
    timestamp: "1h ago",
    unread: 0,
    online: true,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "Hi! I came across your profile and I'm really impressed with your content strategy.",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Thank you so much! I'd love to hear more about what you have in mind.",
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
    {
      id: "3",
      senderId: "1",
      content:
        "We're launching a new product line and think your audience would be a perfect fit. Would you be interested in discussing a partnership?",
      timestamp: new Date(Date.now() - 3400000),
      isOwn: false,
    },
    {
      id: "4",
      senderId: "me",
      content:
        "That sounds exciting. Could you share more details about the product and your vision for the collaboration?",
      timestamp: new Date(Date.now() - 3300000),
      isOwn: true,
    },
    {
      id: "5",
      senderId: "1",
      content: "Looking forward to the collaboration!",
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ],
}

export default function ChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages["1"])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessages(mockMessages[conversation.id] || [])
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content,
      timestamp: new Date(),
      isOwn: true,
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div className="flex h-screen bg-background">
      <ConversationList
        conversations={mockConversations}
        selectedId={selectedConversation.id}
        onSelect={handleSelectConversation}
      />
      <ChatWindow conversation={selectedConversation} messages={messages} onSendMessage={handleSendMessage} />
    </div>
  )
}
