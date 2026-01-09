/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
     Search,
     Send,
     Paperclip,
     MoreVertical,
     ImageIcon,
     Smile,
     Check,
     CheckCheck,
} from "lucide-react";
import { messagesAPI, userAPI } from "@/lib/api";
import { authStorage } from "@/lib/authHelper";
import {
     initSocket,
     sendMessage,
     onReceiveMessage,
     markAsRead,
     disconnectSocket,
} from "@/lib/socket";

interface Message {
     _id: string;
     senderId: string;
     receiverId: string;
     senderType: string;
     receiverType: string;
     content: string;
     isRead: boolean;
     createdAt: string;
     conversationId: string;
}

interface Conversation {
     _id: string;
     participants: Array<{
          id: string;
          model: string;
          name?: string;
          avatar?: string;
     }>;
     lastMessage?: {
          content: string;
          createdAt: string;
     };
     unreadCount?: number;
}

export default function MessageContent() {
     const router = useRouter();
     const searchParams = useSearchParams();
     const [user, setUser] = useState<any>(null);
     const [conversations, setConversations] = useState<Conversation[]>([]);
     const [messages, setMessages] = useState<Message[]>([]);
     const [selectedConversation, setSelectedConversation] =
          useState<Conversation | null>(null);
     const [newMessage, setNewMessage] = useState("");
     const [showConversations, setShowConversations] = useState(true);
     const [loading, setLoading] = useState(true);
     const [socketConnected, setSocketConnected] = useState(false);
     const messagesEndRef = useRef<HTMLDivElement>(null);
     const hasHandledUrlParams = useRef(false);

     // Initialize user and socket
     useEffect(() => {
          const storedUser = authStorage.getUser();
          setUser(storedUser);

          if (storedUser) {
               console.log("👤 User loaded:", storedUser.id, storedUser.role);

               // Initialize socket
               const socket = initSocket(storedUser.id, storedUser.role);

               if (socket) {
                    setSocketConnected(true);
                    console.log("🔌 Socket initialized");

                    // Load conversations
                    loadConversations();

                    // Listen for new messages
                    const cleanupReceive = onReceiveMessage((newMsg: any) => {
                         console.log("📨 Socket received message:", newMsg);
                         handleNewMessage(newMsg);
                    });

                    // Listen for message sent confirmation
                    socket.on("message_sent", (data: any) => {
                         console.log("✅ Message sent confirmation:", data);
                         // Reload conversations after a short delay
                         setTimeout(() => {
                              console.log("🔄 Reloading conversations after message sent...");
                              loadConversations();
                         }, 1000);
                    });

                    socket.on("message_error", (error: any) => {
                         console.error("❌ Socket message error:", error);
                    });

                    return () => {
                         cleanupReceive();
                         socket.off("message_sent");
                         socket.off("message_error");
                         disconnectSocket();
                    };
               } else {
                    console.error(
                         "❌ Failed to initialize socket - no token found"
                    );
               }
          } else {
               console.error("❌ No user found in storage");
          }
     }, []);

     // Handle URL params after conversations load
     useEffect(() => {
          if (!user || loading || hasHandledUrlParams.current) return;

          const newConvUserId = searchParams.get("newConversation");
          const newConvUserType = searchParams.get("type") as
               | "company"
               | "influencer"
               | null;
          const conversationId = searchParams.get("conversationId");

          console.log("🔍 Checking URL params:", { newConvUserId, newConvUserType, conversationId });

          // Handle existing conversation by ID
          if (conversationId) {
               const conv = conversations.find((c) => c._id === conversationId);
               if (conv) {
                    console.log("✅ Found conversation by ID:", conversationId);
                    setSelectedConversation(conv);
                    setShowConversations(false);
                    hasHandledUrlParams.current = true;
               }
               return;
          }

          // Handle new conversation
          if (newConvUserId && newConvUserType) {
               console.log("🆕 Handling new conversation with:", newConvUserId);
               
               // Check if conversation already exists
               const existingConv = conversations.find((conv) =>
                    conv.participants.some((p) => p.id === newConvUserId)
               );

               if (existingConv) {
                    console.log("✅ Found existing conversation:", existingConv._id);
                    setSelectedConversation(existingConv);
                    setShowConversations(false);
                    hasHandledUrlParams.current = true;
               } else {
                    console.log("🔄 Creating temp conversation...");
                    loadUserDetailsAndCreateTempConversation(
                         newConvUserId,
                         newConvUserType
                    );
                    hasHandledUrlParams.current = true;
               }
          }
     }, [user, loading, conversations, searchParams]);

     // Load messages when conversation selected
     useEffect(() => {
          if (selectedConversation && selectedConversation._id !== "new") {
               loadMessages(selectedConversation._id);
          } else if (selectedConversation?._id === "new") {
               // Clear messages for new conversation
               setMessages([]);
          }
     }, [selectedConversation]);

     // Auto-scroll to bottom
     useEffect(() => {
          scrollToBottom();
     }, [messages]);

     const loadConversations = async () => {
          try {
               console.log("📥 Loading conversations...");
               const response = await messagesAPI.getConversations();
               
               if (response.error) {
                    console.error("❌ Error loading conversations:", response.error);
                    setLoading(false);
                    return;
               }

               // Handle nested data structure from backend
               const backendResponse = response.data as any;
               console.log("📦 Conversations API raw response:", JSON.stringify(backendResponse, null, 2));
               
               const data = backendResponse?.data || [];
               console.log("✅ Parsed conversations array:", data);
               console.log("✅ Loaded conversations count:", data.length);
               
               if (data.length > 0) {
                    console.log("📋 First conversation details:", data[0]);
               }
               
               setConversations(data);
               
               // Only auto-select first conversation if no URL params
               const hasUrlParams = searchParams.get("newConversation") || searchParams.get("conversationId");
               if (data.length > 0 && !selectedConversation && !hasUrlParams) {
                    setSelectedConversation(data[0]);
                    setShowConversations(false);
               }
          } catch (error) {
               console.error("❌ Error loading conversations:", error);
          } finally {
               setLoading(false);
          }
     };

     const loadMessages = async (conversationId: string) => {
          try {
               console.log(
                    "📥 Loading messages for conversation:",
                    conversationId
               );
               const response = await messagesAPI.getMessages(conversationId);
               
               if (response.error) {
                    console.error("❌ Error loading messages:", response.error);
                    return;
               }

               // Handle nested data structure
               const backendResponse = response.data as any;
               const msgs = backendResponse?.data || [];
               
               console.log("✅ Loaded messages:", msgs.length);
               setMessages(msgs);

               // Mark unread messages as read
               msgs.filter(
                    (msg: Message) => msg.receiverId === user?.id && !msg.isRead
               ).forEach((msg: Message) => {
                    console.log("📖 Marking message as read:", msg._id);
                    markAsRead(msg._id);
               });
          } catch (error) {
               console.error("❌ Error loading messages:", error);
          }
     };

     const loadUserDetailsAndCreateTempConversation = async (
          userId: string,
          userType: "company" | "influencer"
     ) => {
          try {
               console.log(
                    "📥 Loading user details for new conversation:",
                    userId,
                    "type:",
                    userType
               );

               // Fetch user details based on type
               let userName = "Unknown User";
               let userAvatar = "/placeholder.svg";

               if (userType === "influencer") {
                    const response = await userAPI.getInfluencerPublic(userId);
                    console.log("📦 Influencer API full response:", response);
                    
                    if (!response.error && response.data) {
                         // Handle nested data structure
                         const backendResponse = response.data as any;
                         const data = backendResponse?.data || backendResponse;
                         console.log("📦 Influencer extracted data:", data);
                         
                         userName = data.displayName || data.username || "Unknown User";
                         userAvatar = data.profileImage || "/placeholder.svg";
                         
                         console.log("✅ Parsed influencer details:", { userName, userAvatar });
                    } else {
                         console.error("❌ Error fetching influencer:", response.error);
                    }
               } else {
                    const response = await userAPI.getCompanyPublic(userId);
                    console.log("📦 Company API full response:", response);
                    
                    if (!response.error && response.data) {
                         // Handle nested data structure
                         const backendResponse = response.data as any;
                         const data = backendResponse?.data || backendResponse;
                         console.log("📦 Company extracted data:", data);
                         
                         userName = data.companyName || "Unknown Company";
                         userAvatar = data.profileImage || "/placeholder.svg";
                         
                         console.log("✅ Parsed company details:", { userName, userAvatar });
                    } else {
                         console.error("❌ Error fetching company:", response.error);
                    }
               }

               console.log("✅ Final user details:", { userName, userAvatar });

               // Create temporary conversation object
               const tempConv: Conversation = {
                    _id: "new",
                    participants: [
                         {
                              id: user?.id,
                              model: user?.role,
                              name: user?.companyName || user?.displayName,
                         },
                         {
                              id: userId,
                              model: userType,
                              name: userName,
                              avatar: userAvatar,
                         },
                    ],
               };

               console.log("🆕 Created temp conversation:", tempConv);
               setSelectedConversation(tempConv);
               setShowConversations(false);
          } catch (error) {
               console.error("❌ Error loading user details:", error);
               
               // Fallback to basic conversation
               const fallbackConv = {
                    _id: "new",
                    participants: [
                         {
                              id: user?.id,
                              model: user?.role,
                              name: user?.companyName || user?.displayName,
                         },
                         { id: userId, model: userType, name: "Unknown User" },
                    ],
               };
               
               console.log("⚠️ Using fallback conversation:", fallbackConv);
               setSelectedConversation(fallbackConv);
               setShowConversations(false);
          }
     };

     const handleNewMessage = async (newMsg: any) => {
          console.log("📨 Processing new message:", newMsg);

          if (Array.isArray(newMsg)) {
               setMessages((prev) => [...prev, ...newMsg]);
               return;
          }

          // Add message to state
          setMessages((prev) => {
               // Prevent duplicates
               if (prev.some(m => m._id === newMsg._id)) {
                    console.log("⚠️ Duplicate message, skipping:", newMsg._id);
                    return prev;
               }
               return [...prev, newMsg];
          });

          // Mark as read if currently opened
          if (
               selectedConversation?._id === newMsg.conversationId &&
               newMsg.receiverId === user?.id
          ) {
               markAsRead(newMsg._id);
          }

          // IMPORTANT: Upgrade "new" → real conversation
          if (selectedConversation?._id === "new" && newMsg.conversationId) {
               console.log("🔄 Upgrading temp conversation to real:", newMsg.conversationId);
               
               try {
                    const res = await messagesAPI.getConversations();
                    const backendResponse = res.data as any;
                    const convs = backendResponse?.data || [];

                    const realConv = convs.find(
                         (c: any) => c._id === newMsg.conversationId
                    );

                    if (realConv) {
                         console.log("✅ Found real conversation:", realConv);
                         setConversations(convs);
                         setSelectedConversation(realConv);

                         // Clean the URL
                         router.replace(
                              `/dashboard/${user.role}/messages?conversationId=${realConv._id}`
                         );
                    }
               } catch (error) {
                    console.error("❌ Error upgrading conversation:", error);
               }
               return;
          }

          // Normal message → just refresh conversation list
          loadConversations();
     };

     const handleSend = () => {
          if (!newMessage.trim() || !selectedConversation || !user) {
               console.log("❌ Cannot send - missing data:", {
                    hasMessage: !!newMessage.trim(),
                    hasConversation: !!selectedConversation,
                    hasUser: !!user
               });
               return;
          }

          const receiver = selectedConversation.participants.find(
               (p) => p.id !== user.id
          );
          
          if (!receiver) {
               console.log("❌ No receiver found in conversation");
               return;
          }

          console.log("📤 Sending message:", {
               to: receiver.id,
               type: receiver.model,
               content: newMessage.substring(0, 50) + "...",
               isNewConversation: selectedConversation._id === "new"
          });

          const messageData = {
               senderId: user.id,
               senderType: user.role,
               receiverId: receiver.id,
               receiverType: receiver.model as "influencer" | "company",
               content: newMessage,
          };

          console.log("📤 Message payload:", messageData);

          // Create optimistic message for immediate UI feedback
          const optimisticMessage: Message = {
               _id: `temp-${Date.now()}`,
               senderId: user.id,
               receiverId: receiver.id,
               senderType: user.role,
               receiverType: receiver.model,
               content: newMessage,
               isRead: false,
               createdAt: new Date().toISOString(),
               conversationId: selectedConversation._id === "new" ? "new" : selectedConversation._id
          };
          
          // Add message to UI immediately
          setMessages(prev => [...prev, optimisticMessage]);
          console.log("✅ Added optimistic message to UI");

          // Clear input immediately for better UX
          setNewMessage("");

          // Send via socket
          sendMessage(messageData);
     };

     const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     };

     const getOtherParticipant = (conv: Conversation) => {
          return conv.participants.find((p) => p.id !== user?.id);
     };

     const formatTime = (date: string) => {
          const d = new Date(date);
          const now = new Date();
          const diff = now.getTime() - d.getTime();

          if (diff < 86400000) {
               return d.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
               });
          }
          return d.toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
          });
     };

     const otherUser = selectedConversation
          ? getOtherParticipant(selectedConversation)
          : null;

     return (
          <div className="min-h-screen bg-background">
               <Sidebar userType={user?.role || "company"} />

               <main className="lg:pl-64">
                    <div className="flex h-[calc(100vh-0px)] flex-col pt-16 lg:pt-0">
                         <div
                              className={cn(
                                   "border-b border-border px-4 py-4 lg:px-8",
                                   !showConversations && "hidden lg:block"
                              )}
                         >
                              <DashboardHeader
                                   title="Messages"
                                   subtitle="Chat with influencers about collaborations"
                              />
                              {/* Socket Status Indicator */}
                              <div className="mt-2 flex items-center gap-2 text-xs">
                                   <div
                                        className={cn(
                                             "h-2 w-2 rounded-full",
                                             socketConnected
                                                  ? "bg-green-500"
                                                  : "bg-red-500"
                                        )}
                                   />
                                   <span className="text-muted-foreground">
                                        {socketConnected
                                             ? "Connected"
                                             : "Disconnected"}
                                   </span>
                              </div>
                         </div>

                         <div className="flex flex-1 overflow-hidden">
                              {/* Conversations List */}
                              <div
                                   className={cn(
                                        "w-full flex-col border-r border-border lg:flex lg:w-80",
                                        showConversations ? "flex" : "hidden"
                                   )}
                              >
                                   <div className="border-b border-border p-4">
                                        <div className="relative">
                                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                             <Input
                                                  placeholder="Search messages..."
                                                  className="pl-10"
                                             />
                                        </div>
                                   </div>

                                   <div className="flex-1 overflow-y-auto">
                                        {loading ? (
                                             <div className="flex items-center justify-center p-8">
                                                  <p className="text-muted-foreground">
                                                       Loading conversations...
                                                  </p>
                                             </div>
                                        ) : conversations.length === 0 ? (
                                             <div className="flex items-center justify-center p-8">
                                                  <p className="text-muted-foreground">
                                                       No conversations yet
                                                  </p>
                                             </div>
                                        ) : (
                                             conversations.map(
                                                  (conversation) => {
                                                       const other =
                                                            getOtherParticipant(
                                                                 conversation
                                                            );
                                                       return (
                                                            <button
                                                                 key={
                                                                      conversation._id
                                                                 }
                                                                 onClick={() => {
                                                                      setSelectedConversation(
                                                                           conversation
                                                                      );
                                                                      setShowConversations(
                                                                           false
                                                                      );
                                                                      router.replace(
                                                                           `/dashboard/${user.role}/messages?conversationId=${conversation._id}`
                                                                      );
                                                                 }}
                                                                 className={cn(
                                                                      "flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/50",
                                                                      selectedConversation?._id ===
                                                                           conversation._id &&
                                                                           "bg-secondary"
                                                                 )}
                                                            >
                                                                 <div className="relative">
                                                                      <img
                                                                           src={
                                                                                other?.avatar ||
                                                                                "/placeholder.svg"
                                                                           }
                                                                           alt={
                                                                                other?.name ||
                                                                                "User"
                                                                           }
                                                                           className="h-12 w-12 rounded-full object-cover"
                                                                      />
                                                                 </div>
                                                                 <div className="flex-1 min-w-0">
                                                                      <div className="flex items-center justify-between">
                                                                           <h3 className="font-medium text-foreground truncate">
                                                                                {other?.name ||
                                                                                     "Unknown"}
                                                                           </h3>
                                                                           {conversation.lastMessage && (
                                                                                <span className="text-xs text-muted-foreground">
                                                                                     {formatTime(
                                                                                          conversation
                                                                                               .lastMessage
                                                                                               .createdAt
                                                                                     )}
                                                                                </span>
                                                                           )}
                                                                      </div>
                                                                      <p className="text-sm text-muted-foreground truncate">
                                                                           {conversation
                                                                                .lastMessage
                                                                                ?.content ||
                                                                                "No messages yet"}
                                                                      </p>
                                                                 </div>
                                                                 {conversation.unreadCount &&
                                                                      conversation.unreadCount >
                                                                           0 && (
                                                                           <Badge className="h-5 w-5 rounded-full bg-accent p-0 text-xs text-accent-foreground">
                                                                                {
                                                                                     conversation.unreadCount
                                                                                }
                                                                           </Badge>
                                                                      )}
                                                            </button>
                                                       );
                                                  }
                                             )
                                        )}
                                   </div>
                              </div>

                              {/* Chat Area */}
                              <div
                                   className={cn(
                                        "flex flex-1 flex-col",
                                        showConversations
                                             ? "hidden lg:flex"
                                             : "flex"
                                   )}
                              >
                                   {selectedConversation ? (
                                        <>
                                             <div className="flex items-center justify-between border-b border-border p-4">
                                                  <div className="flex items-center gap-3">
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="lg:hidden"
                                                            onClick={() =>
                                                                 setShowConversations(
                                                                      true
                                                                 )
                                                            }
                                                       >
                                                            <svg
                                                                 className="h-5 w-5"
                                                                 fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 stroke="currentColor"
                                                            >
                                                                 <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeWidth={
                                                                           2
                                                                      }
                                                                      d="M15 19l-7-7 7-7"
                                                                 />
                                                            </svg>
                                                       </Button>
                                                       <div className="relative">
                                                            <img
                                                                 src={
                                                                      otherUser?.avatar ||
                                                                      "/placeholder.svg"
                                                                 }
                                                                 alt={
                                                                      otherUser?.name ||
                                                                      "User"
                                                                 }
                                                                 className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                       </div>
                                                       <div>
                                                            <h3 className="font-medium text-foreground">
                                                                 {otherUser?.name ||
                                                                      "Unknown"}
                                                            </h3>
                                                            <p className="text-xs text-muted-foreground capitalize">
                                                                 {otherUser?.model ||
                                                                      "User"}
                                                            </p>
                                                       </div>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                       >
                                                            <MoreVertical className="h-5 w-5" />
                                                       </Button>
                                                  </div>
                                             </div>

                                             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                  {selectedConversation._id ===
                                                  "new" ? (
                                                       // For new conversations, show all messages (including optimistic ones)
                                                       messages.length === 0 ? (
                                                            <div className="flex items-center justify-center h-full">
                                                                 <p className="text-muted-foreground">
                                                                      Send a message
                                                                      to start the
                                                                      conversation
                                                                 </p>
                                                            </div>
                                                       ) : (
                                                            messages.map((message) => (
                                                                 <div
                                                                      key={
                                                                           message._id
                                                                      }
                                                                      className={cn(
                                                                           "flex",
                                                                           message.senderId ===
                                                                                user?.id
                                                                                ? "justify-end"
                                                                                : "justify-start"
                                                                      )}
                                                                 >
                                                                      <div
                                                                           className={cn(
                                                                                "max-w-[80%] rounded-2xl px-4 py-2",
                                                                                message.senderId ===
                                                                                     user?.id
                                                                                     ? "bg-accent text-accent-foreground"
                                                                                     : "bg-secondary text-foreground"
                                                                           )}
                                                                      >
                                                                           <p className="text-sm">
                                                                                {
                                                                                     message.content
                                                                                }
                                                                           </p>
                                                                           <div
                                                                                className={cn(
                                                                                     "mt-1 flex items-center justify-end gap-1 text-xs",
                                                                                     message.senderId ===
                                                                                          user?.id
                                                                                          ? "text-accent-foreground/70"
                                                                                          : "text-muted-foreground"
                                                                                )}
                                                                           >
                                                                                <span>
                                                                                     {formatTime(
                                                                                          message.createdAt
                                                                                     )}
                                                                                </span>
                                                                                {message.senderId ===
                                                                                     user?.id &&
                                                                                     (message.isRead ? (
                                                                                          <CheckCheck className="h-3 w-3" />
                                                                                     ) : (
                                                                                          <Check className="h-3 w-3" />
                                                                                     ))}
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            ))
                                                       )
                                                  ) : (
                                                       messages
                                                            .filter(
                                                                 (msg) =>
                                                                      msg.conversationId ===
                                                                      selectedConversation._id
                                                            )
                                                            .map((message) => (
                                                                 <div
                                                                      key={
                                                                           message._id
                                                                      }
                                                                      className={cn(
                                                                           "flex",
                                                                           message.senderId ===
                                                                                user?.id
                                                                                ? "justify-end"
                                                                                : "justify-start"
                                                                      )}
                                                                 >
                                                                      <div
                                                                           className={cn(
                                                                                "max-w-[80%] rounded-2xl px-4 py-2",
                                                                                message.senderId ===
                                                                                     user?.id
                                                                                     ? "bg-accent text-accent-foreground"
                                                                                     : "bg-secondary text-foreground"
                                                                           )}
                                                                      >
                                                                           <p className="text-sm">
                                                                                {
                                                                                     message.content
                                                                                }
                                                                           </p>
                                                                           <div
                                                                                className={cn(
                                                                                     "mt-1 flex items-center justify-end gap-1 text-xs",
                                                                                     message.senderId ===
                                                                                          user?.id
                                                                                          ? "text-accent-foreground/70"
                                                                                          : "text-muted-foreground"
                                                                                )}
                                                                           >
                                                                                <span>
                                                                                     {formatTime(
                                                                                          message.createdAt
                                                                                     )}
                                                                                </span>
                                                                                {message.senderId ===
                                                                                     user?.id &&
                                                                                     (message.isRead ? (
                                                                                          <CheckCheck className="h-3 w-3" />
                                                                                     ) : (
                                                                                          <Check className="h-3 w-3" />
                                                                                     ))}
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            ))
                                                  )}
                                                  <div ref={messagesEndRef} />
                                             </div>

                                             <div className="border-t border-border p-4">
                                                  <div className="flex items-center gap-2">
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                       >
                                                            <Paperclip className="h-5 w-5" />
                                                       </Button>
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                       >
                                                            <ImageIcon className="h-5 w-5" />
                                                       </Button>
                                                       <Input
                                                            placeholder="Type a message..."
                                                            className="flex-1"
                                                            value={newMessage}
                                                            onChange={(e) =>
                                                                 setNewMessage(
                                                                      e.target
                                                                           .value
                                                                 )
                                                            }
                                                            onKeyDown={(e) =>
                                                                 e.key ===
                                                                      "Enter" &&
                                                                 handleSend()
                                                            }
                                                       />
                                                       <Button
                                                            variant="ghost"
                                                            size="icon"
                                                       >
                                                            <Smile className="h-5 w-5" />
                                                       </Button>
                                                       <Button
                                                            size="icon"
                                                            className="bg-accent hover:bg-accent/90"
                                                            onClick={handleSend}
                                                       >
                                                            <Send className="h-5 w-5" />
                                                       </Button>
                                                  </div>
                                             </div>
                                        </>
                                   ) : (
                                        <div className="flex items-center justify-center flex-1">
                                             <p className="text-muted-foreground">
                                                  Select a conversation to start
                                                  chatting
                                             </p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
}