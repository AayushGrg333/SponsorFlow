import { Router, Request, Response } from "express";
import { ConversationModel } from "../models/Conversation";
import { MessageModel } from "../models/message";
import verifyToken from "../middlewares/verifytoken";
import mongoose from "mongoose";

const router = Router();

/**
 * @route   GET /messages/conversations
 * @desc    Get all conversations for the authenticated user
 * @access  Private
 */
// Update your GET /conversations route in your backend

router.get("/conversations", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userType = (req as any).user.usertype;

    console.log("🔍 Looking for conversations for:", userId, userType);

    // Convert userId to ObjectId for comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find all conversations where user is a participant
    const conversations = await ConversationModel.find({
      participants: {
        $elemMatch: { 
          id: userObjectId,
          model: userType 
        },
      },
    }).lean();

    console.log("💬 Found conversations:", conversations.length);

    // For each conversation, get the last message and unread count
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Get last message
        const lastMessage = await MessageModel.findOne({
          conversationId: conv._id,
        })
          .sort({ createdAt: -1 })
          .select("content createdAt")
          .lean();

        // Get unread count
        const unreadCount = await MessageModel.countDocuments({
          conversationId: conv._id,
          receiver: userObjectId,
          isRead: false,
        });

        // Get other participant details
        const otherParticipant = conv.participants.find(
          (p: any) => p.id.toString() !== userId
        );

        // Populate participant info based on their model type
        let participantDetails: any = null;
        if (otherParticipant) {
          try {
            const ModelName = otherParticipant.model === "company" ? "Company" : "User";
            const Model = mongoose.model(ModelName);

            participantDetails = await Model.findById(otherParticipant.id)
              .select("username displayName companyName profileImage avatar profilePicture")
              .lean();

            console.log(`👤 Loaded ${ModelName} details:`, participantDetails);
          } catch (modelError) {
            console.error("Error loading participant details:", modelError);
            // Continue without participant details rather than failing
          }
        }

        return {
          _id: conv._id,
          participants: conv.participants.map((p: any) => ({
            id: p.id.toString(),
            model: p.model,
            name: p.id.toString() === userId 
              ? null 
              : (participantDetails?.displayName || 
                 participantDetails?.companyName || 
                 participantDetails?.username || 
                 "Unknown User"),
            avatar: p.id.toString() === userId 
              ? null 
              : (participantDetails?.profileImage || 
                 participantDetails?.avatar || 
                 participantDetails?.profilePicture || 
                 null),
          })),
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : undefined,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    conversationsWithDetails.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    console.log("✅ Returning conversations with details:", conversationsWithDetails.length);

    res.json({
      status: "success",
      data: conversationsWithDetails,
    });
  } catch (error :any ) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
});
/**
 * @route   GET /messages/:conversationId
 * @desc    Get all messages for a specific conversation
 * @access  Private
 */
router.get("/:conversationId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user.id;
    const userType = (req as any).user.usertype;

    // Verify user is part of this conversation
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      participants: {
        $elemMatch: { id: userId, model: userType },
      },
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: "Conversation not found or access denied",
      });
    }

    // Get all messages
    const messages = await MessageModel.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    })
      .sort({ createdAt: 1 })
      .lean();

    // Transform to match frontend interface
    const transformedMessages = messages.map((msg) => ({
      _id: msg._id.toString(),
      senderId: msg.sender.toString(),
      receiverId: msg.receiver.toString(),
      senderType: msg.senderType,
      receiverType: msg.receiverType,
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      conversationId: msg.conversationId.toString(),
    }));

    res.json({
      success: true,
      data: transformedMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
  }
});

/**
 * @route   PATCH /messages/:messageId/read
 * @desc    Mark a message as read
 * @access  Private
 */
router.patch("/:messageId/read", verifyToken, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = (req as any).user.id;

    // Update only if the current user is the receiver
    const message = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        receiver: new mongoose.Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      res.status(404).json({
        success: false,
        error: "Message not found or not authorized",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark message as read",
    });
  }
});

export default router;