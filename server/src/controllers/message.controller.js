import Message from '../models/message.model.js';
import cloudinary from '../utils/cloudinary.js';
export const getMessagesById = async(req, res) => {
    try {
        const userToChatId = req.params.id;
        const senderId = req.user._id;

        const messages = await Message.find({
        $or:[
            {
                senderId: senderId, receiverId: userToChatId
            },{
                senderId: userToChatId, receiverId: senderId
            }
        ]
        }).lean();

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({message: "Error fetching messages:"});
    }
}

export const sendMessagesById = async(req, res) => {
    const {text, image} = req.body;
   try {
    
    const userToChatId = req.params.id;
    const senderId = req.user._id;
let imageUrl = "";
    if(image){
        const cloudResponse = await cloudinary.uploader.upload(image);
       imageUrl = cloudResponse.secure_url;
    }

    const newMessage = new Message({
        text,
        image: imageUrl,
        senderId,
        receiverId: userToChatId
    })
    await newMessage.save();
      res.status(201).json(newMessage);
   } catch (error) {
     console.log("Error sending message: ", error.message);
    res.status(500).json({ message: "Error sending message" });
   }
   
}