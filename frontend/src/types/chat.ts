export interface Conversation {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  isOwn: boolean
}
