📰 Blog Platform

A full-stack blog application built with React, Node.js, Express, and MongoDB.
It supports authentication, post creation, comments, admin controls, dark mode, SEO optimization, and more.

🚀 Features
🔐 Authentication

User registration & login

JWT/session authentication (depending on configuration)

Forgot password & reset password

✍️ Blogging

Create, edit, and delete posts

Rich text and image uploads

Categories & trending posts

Bookmarking posts

👥 User Features

Profile management

Personalized dashboard

Dark/light mode with localStorage persistence

🛠️ Admin Features

Admin dashboard for managing posts, users, and comments

Notifications system

🌐 SEO & Performance

Dynamic sitemap generation (/sitemap.xml)

react-helmet-async for SEO metadata

i18n (internationalization support)

Lazy loading for improved performance

🏗️ Tech Stack

Frontend

React + React Router v6

TailwindCSS (utility-first styling)

React Helmet Async (SEO)

Context API for Dark Mode

i18next (internationalization)

Backend

Node.js + Express.js

MongoDB + Mongoose

Multer (file/image uploads)

CORS support

dotenv for environment configs

📂 Project Structure
blog-app/
│
├── backend/
│   ├── models/         
│   ├── routes/        
│   ├── uploads/        
│   └── server.js       
│
├── frontend/
│   ├── public/         
│   ├── src/
│   │   ├── components/ 
│   │   ├── pages/     
│   │   ├── App.js      
│   │   └── i18n.js     
│   └── package.json
│
└── README.md

⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/patelaayush11330/blog-platform.git
cd blog-platform

2. Backend Setup
cd backend
npm install


Create a .env file in /backend:

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret


Run the backend:

npm start

3. Frontend Setup
cd frontend
npm install


Run the frontend:

npm start


Now your app will run at:

Backend → http://localhost:5000

Frontend → http://localhost:3000

📌 Available Routes
Frontend Pages

/ → Home

/login → User login

/register → User registration

/dashboard → User dashboard

/admin → Admin dashboard

/post/:id → Post details

/posts → All posts

/categories → Categories listing

/trending → Trending posts

/bookmarks → User bookmarks

/profile → Profile page

/forgot-password / /reset-password/:token → Password reset flow

/about, /contact, /privacy, /terms, /careers

Backend API

/api/auth → Auth routes

/api/posts → Posts CRUD

/api/comments → Comments CRUD

/api/users → User management

/api/notifications → Notifications

/api/admin → Admin routes

/api/upload → Image uploads

/sitemap.xml → Sitemap generation

🛡️ Security

Protected routes for authenticated users

Admin-only access for sensitive actions

Secure password handling & JWT/session support

CORS configuration for frontend/backend

📄 License

This project is licensed under the MIT License – feel free to use and modify.
