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
router.get("/conversations", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // From your auth middleware
    const userType = (req as any).user.usertype; // "influencer" or "company"

    // Find all conversations where user is a participant
    const conversations = await ConversationModel.find({
      participants: {
        $elemMatch: { id: userId, model: userType },
      },
    }).lean();

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
          receiver: new mongoose.Types.ObjectId(userId),
          isRead: false,
        });

        // Get other participant details
        const otherParticipant = conv.participants.find(
          (p: any) => p.id.toString() !== userId
        );

        // Populate participant info based on their model type
        let participantDetails: any = null;
        if (otherParticipant) {
          const Model =
            otherParticipant.model === "influencer"
              ? mongoose.model("Influencer")
              : mongoose.model("Company");

          participantDetails = await Model.findById(otherParticipant.id)
            .select("name avatar profilePicture")
            .lean();
        }

        return {
          _id: conv._id,
          participants: conv.participants.map((p: any) => ({
            id: p.id.toString(),
            model: p.model,
            name: p.id.toString() === userId ? null : (participantDetails?.name || null),
            avatar: p.id.toString() === userId ? null : (participantDetails?.avatar || participantDetails?.profilePicture || null),
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

    res.json({
      success: true,
      data: conversationsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversations",
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