/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
import { messagesAPI } from "./api"

/**
 * Get or create a conversation with a specific user and navigate to messages
 * @param currentUserId - The current user's ID
 * @param currentUserType - The current user's type (company/influencer)
 * @param targetUserId - The target user's ID to message
 * @param targetUserType - The target user's type (company/influencer)
 * @param router - Next.js router instance
 */
export const startConversation = async (
  currentUserId: string,
  currentUserType: "company" | "influencer",
  targetUserId: string,
  targetUserType: "company" | "influencer",
  router: any
) => {
  try {
    // Get all conversations
    const response = await messagesAPI.getConversations()
    
    if (response.data && !response.error) {
      const conversations = (response.data as any).data
      
      // Find existing conversation with this user
      const existingConversation = conversations.find((conv: any) => 
        conv.participants.some((p: any) => p.id === targetUserId)
      )
      
      if (existingConversation) {
        // Navigate to existing conversation
        router.push(`/dashboard/${currentUserType}/messages?conversationId=${existingConversation._id}`)
      } else {
        // Navigate to messages page - conversation will be created when first message is sent
        router.push(`/dashboard/${currentUserType}/messages?newConversation=${targetUserId}&type=${targetUserType}`)
      }
    } else {
      // If error, just navigate to messages page
      router.push(`/dashboard/${currentUserType}/messages?newConversation=${targetUserId}&type=${targetUserType}`)
    }
  } catch (error) {
    console.error("Error starting conversation:", error)
    // Fallback to messages page
    router.push(`/dashboard/${currentUserType}/messages?newConversation=${targetUserId}&type=${targetUserType}`)
  }
}