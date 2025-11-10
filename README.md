# Social Media Application

A full-stack social media application built for 3W Full Stack Internship Assignment.

##  Features

-  User Authentication (Register & Login)
-  Create Posts (Text & Images via URL)
-  View Feed (All posts from all users)
-  Like Posts (Toggle like/unlike)
-  Comment on Posts
-  Real-time UI Updates
-  Responsive Design

##  Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Bcrypt

##  Project Structure

social-media-app/
 backend/ # Backend API (Node.js + Express)
models/ # MongoDB Models
routes/ # API Routes
│  server.js # Entry Point

├ frontend/ # Frontend App (React)
    src/
         components/
             pages/
            services/
              public/
     README.md

text

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas Account
- Git

### Backend Setup

cd backend
npm install

text

Create `.env` file in backend folder:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

text

Start backend:
npm start

text

### Frontend Setup

cd frontend
npm install
npm start

text

The app will run on `http://localhost:3000`

##  Live Demo

- **Frontend:** [https://social-media-app-mu-five.vercel.app]
- **Backend:** [https://social-media-app-backend-em7y.onrender.com]

##  Screenshots

[Add screenshots after deployment]

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/Unlike post
- `POST /api/posts/:id/comment` - Comment on post

## Assignment Requirements

This project was built as part of 3W Full Stack Internship Assignment Round 1.

**Key Requirements Met:**
-  User authentication with MongoDB
-  Create posts with text/images
-  Public feed showing all posts
-  Like and comment functionality
-  Clean, modern UI
-  Deployed on Vercel (Frontend) & Render (Backend)

##  Future Enhancements

- Direct file upload for images
- User profiles
- Edit/Delete posts
- Post pagination
- Search functionality
- Real-time notifications

##  Developer

**[Your Name]**
- GitHub: [@your-username]
- Email: your-email@example.com