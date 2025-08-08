import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js"

export const updateProfile = async (req, res) => {
    const {profilePic} = req.body;
    if(!profilePic) {
        return res.status(400).json({ message: 'Profile picture is required' });
    }
    try {
          const userId = req.userId;
          const uploadResponse = await cloudinary.uploader.upload(profilePic);
          const updatedUser =  await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url},{new: true});
          res.status(200).json({updatedUser});
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Error updating profile:' });
    }
  

};

export const checkAuth = async(req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "Unauthorized"});
        }
        res.json({user});
    } catch (error) {
        console.error("Error checking auth:", error);
        return res.status(400).json({message: "Error checking auth"});

    }
}

export const getUsersForSidebar = async(req, res) => {
   try {
        const loggedInUserId = req.userId;
        const otherUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.json({users: otherUsers})
   } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    return res.status(500).json({message: "Error fetching users for sidebar"});
   }
}