#   🌟 Chatify

A modern, full-stack real-time chat application built with React and Node.js, featuring secure authentication, real-time messaging, and a sleek UI.



##  ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT
- 👤 **User Profiles** - Customizable user profiles with avatars
- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 🌙 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 📱 **Responsive Design** - Optimized for all devices
- 🎨 **Modern UI** - Clean and intuitive interface with Tailwind CSS
- 🖼️ **Image Sharing** - Send and receive images in chats
- 🔍 **User Discovery** - Find and connect with other users

## 🛠️ Tech Stack

### 🎯 Frontend
- **Framework:** React with Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Real-time Communication:** Socket.IO Client

### ⚙️ Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Real-time Server:** Socket.IO
- **File Upload:** Cloudinary
- **CORS:** Enabled for cross-origin requests

### 🧰 Development Tools
- **Build Tool:** Vite
- **Package Manager:** npm
- **Linting:** ESLint

## Screenshots
![Screenshot 1](/client/public/Screenshots/s1.png)
![Screenshot 2](/client/public/Screenshots/s2.png)
![Screenshot 3](/client/public/Screenshots/s3.png)
![Screenshot 4](/client/public/Screenshots/s4.png)
![Screenshot 5](/client/public/Screenshots/s5.png)
![Screenshot 6](/client/public/Screenshots/s6.png)
![Screenshot 7](/client/public/Screenshots/s7.png)


## 🚀 Getting Started

### Prerequisites
- Node.js (version specified in package.json)
- npm or yarn
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatify.git
   cd chatify
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

### 🔧 Environment Variables Setup

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env

PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatify
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_MODE=development
```

### 🚀 Running the Application

#### Development Mode (Live Preview)

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   



2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
  

