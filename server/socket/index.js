const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const {
    ConversationModel,
    MessageModel,
} = require('../models/ConversationModel');

const app = express();

// socket connection

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

// online user
const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log('User connected', socket.id);
    const token = socket.handshake.auth.token;

    // current user details
    const user = await getUserDetailsFromToken(token);

    // create a room
    socket.join(user?._id.toString());
    onlineUser.add(user?._id.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('message-page', async (userId) => {
        // console.log('userid', userId);
        const userDetails = await UserModel.findById(userId).select(
            '-password',
        );
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId),
        };
        socket.emit('message-user', payload);

        // get previous msg
        const getConvesationMessage = await ConversationModel.findOne({
            $or: [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id },
            ],
        })
            .populate('messages')
            .sort({ updatedAt: -1 });

        socket.emit('message', getConvesationMessage?.messages);
    });

    // new msg
    socket.on('new message', async (data) => {
        // check  conversation is available both user
        let conversation = await ConversationModel.findOne({
            $or: [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender },
            ],
        });

        // if conversation is not available
        if (!conversation) {
            const createConvesation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver,
            });
            conversation = await createConvesation.save();
        }

        const msg = new MessageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId,
        });

        const saveMsg = await msg.save();

        const updateConvesation = await ConversationModel.updateOne(
            {
                _id: conversation?._id,
            },
            {
                $push: { messages: saveMsg?._id },
            },
        );

        const getConvesationMessage = await ConversationModel.findOne({
            $or: [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender },
            ],
        })
            .populate('messages')
            .sort({ updatedAt: -1 });
        io.to(data?.sender).emit('message', getConvesationMessage?.messages);
        io.to(data?.receiver).emit('message', getConvesationMessage?.messages);
    });

    // sidebar
    socket.on('sidebar', async (currentUserId) => {
        // console.log('currentUserId', currentUserId);
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
                const countUnseenMsg = data?.messages.reduce(
                    (prev, curr) => prev + (curr?.seen ? 0 : 1),
                    0,
                );
                return {
                    _id: data?._id,
                    sender: data?.sender,
                    receiver: data?.receiver,
                    unSeenMsg: countUnseenMsg,
                    lastMsg: data?.messages[data?.messages?.length - 1],
                };
            });

            socket.emit('conversation', conversation);
        }
    });

    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        console.log('User disconnected', socket.id);
    });
});

module.exports = { app, server };
