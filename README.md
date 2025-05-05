# 🐶 Doggy Detection App

A full-stack mobile application for dog detection. The frontend is built with **React Native + Expo**, and the backend is a **Node.js server** that connects to a database for user management and detection history tracking.

---

## 📁 Project Structure

```
doggy-detection/
├── client/         # React Native app (Expo)
├── server/         # Node.js backend with DB
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.18.2)
- npm
- Expo Go (mobile app)
- MongoDB
- Git

---

## 🔧 1. Run the Server (Backend)

```bash
cd server
npm install
```

Create a `.env` file in `server/` and configure it like this:

```stylus
DATABASE=mongodb+srv://<username>:<password>@cluster0.mwf6av5.mongodb.net/doggy?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
SENDGRID_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email@example.com
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Then start the backend:

```bash
npm start
```

> Server starts on `http://localhost:3000`.  
> ⚠️ If testing on a real device, use your computer’s IP instead of `localhost`.

---

## 📱 2. Run the Mobile App (Client)

```bash
cd client
npm install
npx expo start
```

Then:

- Use **Expo Go** to scan the QR code
- Or press `i` / `a` to launch iOS/Android simulator

---

## 🌐 Configure API Endpoint

In your client app (e.g., `client/Constants.js`):

```js
// client/Constants.js
export const IP = "localhost"; // Replace with your actual IP address
```

> Replace `localhost` with your actual server IP (run the command `ipconfig` to check the `IPv4 Address`) when using a physical device.

---

## 🧠 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **ML Model:** Served via API route

---

## 🐕 Features

- 📸 Take or upload a photo
- 🔍 Detect dog breeds via ML model API
- 👤 User authentication (login/register)
- 📜 Detection history saved to DB
- 🔐 Secure API with JWT tokens
