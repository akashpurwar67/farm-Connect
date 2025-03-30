import user from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id.toString();

        // Fetch messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        });

        // Extract unique user IDs, excluding the logged-in user
        const users = [...new Set(messages.map(message => 
            message.senderId.toString() === loggedInUserId 
                ? message.receiverId.toString() 
                : message.senderId.toString()
        ))].filter(userId => userId !== loggedInUserId);

        // Fetch user details
        const filteredUsers = await user.find({ _id: { $in: users } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Error in getUsersForSidebar:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};




export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId,receiverId: userToChatId},
                {senderId: userToChatId,receiverId: myId}
            ]
            
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages: ',error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        //real time message sending
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage: ',error.message);
        res.status(500).json({message: 'Server Error'});
        
    }
};