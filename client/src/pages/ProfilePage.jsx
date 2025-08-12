import React from 'react'
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Camera, Mail, User } from "lucide-react";



const ProfilePage = () => {
  const {authUser, isUpdatingProfile,  updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
  <div className="min-h-screen pt-12 px-4">
  <div className="max-w-md mx-auto pt-20 ">
    <div className="bg-base-300 rounded-lg p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-gray-400">Your profile information</p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <img
            src={selectedImg || authUser.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-1.5 rounded-full cursor-pointer transition-all duration-200 ${
              isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
            }`}
          >
            <Camera className="w-4 h-4 text-base-200" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p className="text-xs text-zinc-400">
          {isUpdatingProfile ? "Uploading..." : "Tap the camera icon to update photo"}
        </p>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div>
          <div className="text-xs text-zinc-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Full Name
          </div>
          <p className="px-3 py-2 bg-base-200 rounded border text-sm">
            {authUser?.fullname}
          </p>
        </div>

        <div>
          <div className="text-xs text-zinc-400 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            Email
          </div>
          <p className="px-3 py-2 bg-base-200 rounded border text-sm">
            {authUser?.email}
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-base-200 rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Account Info</h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b pb-1">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  )
}

export default ProfilePage