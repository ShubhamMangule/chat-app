const { ConversationModel } = require('../models/ConversationModel');

const getConversation = async (currentUserId) => {
    if (currentUserId) {
        const currentUserConversation = await ConversationModel.find({
            $or: [
                { sender: currentUserId ?? null },
                {
                    receiver: currentUserId,
                },
            ],
        })
            .sort({ updatedAt: -1 })
            .populate('messages')
            .populate('sender')
            .populate('receiver');

        const conversation = currentUserConversation?.map((data) => {
            const countUnseenMsg = data?.messages.reduce((prev, curr) => {
                if (curr?.msgByUserId.toString() !== currentUserId) {
                    return prev + (curr?.seen ? 0 : 1);
                } else {
                    return prev;
                }
            }, 0);
            return {
                _id: data?._id,
                sender: data?.sender,
                receiver: data?.receiver,
                unSeenMsg: countUnseenMsg,
                lastMsg: data?.messages[data?.messages?.length - 1],
            };
        });

        return conversation;
    } else {
        return [];
    }
};

module.exports = getConversation;
