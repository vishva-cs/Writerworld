# WriterWorld - AI-Powered Book Publishing Platform

![WriterWorld](https://img.shields.io/badge/WriterWorld-v1.0-purple?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18%2B-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-API-orange?style=for-the-badge)

## 🚀 Overview

WriterWorld is a modern, full-stack AI-powered book publishing web application that enables users to create, publish, and discover books with intelligent AI writing assistance. Built with React, Node.js, MongoDB, and OpenAI API integration.

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT-based authentication with password encryption
- 📚 **Book Management** - Create, edit, save, and publish books
- ✍️ **Rich Text Editor** - Write chapters with advanced formatting
- 🔍 **Smart Search** - Search by title, category, or author
- 👥 **Social Features** - Like, comment, and follow writers
- 🌍 **Multi-language Support** - English and Telugu
- 📱 **Mobile-First Design** - Fully responsive UI

### AI Features
- 🤖 **AI Writing Assistance** - Grammar corrections and style improvements
- 💡 **Story Ideas Generator** - Automatic story ideation
- 📄 **Summary Generation** - Auto-generate book summaries
- 🎨 **Cover Image Generation** - AI-powered book cover creation
- 🔊 **Voice Reading** - Text-to-speech for books

### Advanced Features
- 💎 **Premium Membership** - Subscription-based features
- 📊 **Writer Analytics** - Detailed dashboard analytics
- 📖 **Reading History** - Bookmarks and reading progress
- 🌙 **Dark Theme** - Futuristic purple gradient design

## 🏗️ Architecture

```
WriterWorld/
├── client/                 # Frontend (React + Tailwind)
├── server/                 # Backend (Node.js + Express)
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── controllers/            # Business logic
├── middleware/             # Authentication & validation
├── config/                 # Configuration files
├── .env.example            # Environment variables template
├── docker-compose.yml      # Docker configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18+
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Rich Text Editor**: Quill.js
- **Authentication**: JWT with localStorage
- **Image Upload**: Cloudinary/AWS S3

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **AI Integration**: OpenAI API
- **Email**: Nodemailer
- **Validation**: Joi/express-validator

### DevOps & Hosting
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render/Railway
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions

## 📋 Project Structure

### Frontend Structure (client/)
```
client/
├── public/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── utils/            # Helper functions
│   ├── services/         # API calls
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context
│   ├── App.jsx
│   └── index.css
├── .env.local
├── tailwind.config.js
└── package.json
```

### Backend Structure (server/)
```
server/
├── models/              # MongoDB schemas
├── routes/              # API routes
├── controllers/         # Business logic
├── middleware/          # Custom middleware
├── config/              # Configuration
├── utils/               # Helper functions
├── validators/          # Request validators
├── .env
├── server.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- OpenAI API key
- Cloudinary account (for image uploads)
- Firebase account (optional, for authentication)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/vishva-cs/WriterWorld.git
cd WriterWorld
```

#### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

#### 3. Setup Frontend
```bash
cd ../client
npm install
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm start
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
NODE_ENV=development
```

#### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_OPENAI_KEY=your_openai_key
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Book Endpoints
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/:id/publish` - Publish book
- `GET /api/books/search` - Search books

### Chapter Endpoints
- `GET /api/books/:id/chapters` - Get chapters
- `POST /api/books/:id/chapters` - Create chapter
- `PUT /api/chapters/:id` - Update chapter
- `DELETE /api/chapters/:id` - Delete chapter

### Social Endpoints
- `POST /api/books/:id/like` - Like book
- `DELETE /api/books/:id/like` - Unlike book
- `POST /api/books/:id/comment` - Add comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/writers/:id/follow` - Follow writer
- `DELETE /api/writers/:id/follow` - Unfollow writer

### AI Endpoints
- `POST /api/ai/generate-ideas` - Generate story ideas
- `POST /api/ai/generate-summary` - Generate book summary
- `POST /api/ai/grammar-check` - Check grammar
- `POST /api/ai/generate-cover` - Generate cover image
- `POST /api/ai/voice-read` - Generate voice reading

## 🎨 Design System

### Color Palette
- **Primary**: `#a855f7` (Purple)
- **Secondary**: `#ec4899` (Pink)
- **Dark BG**: `#0f172a` (Slate)
- **Accent**: `#06b6d4` (Cyan)

### Typography
- **Font**: Inter, Poppins
- **Headings**: Bold, Dark
- **Body**: Regular, Gray-600

### Components
- Glassmorphism cards
- Smooth animations
- Gradient buttons
- Responsive grid

## 📖 Features Documentation

### 1. Authentication System
JSON Web Token (JWT) based authentication with bcrypt password hashing.

### 2. Rich Text Editor
Quill.js integration for advanced chapter writing with formatting options.

### 3. Book Publishing
Three-step publishing: Write → Preview → Publish with metadata management.

### 4. AI Integration
OpenAI API integration for content generation and enhancement.

### 5. Multi-language Support
Tailwind i18n setup with English and Telugu support.

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Configure IP whitelist
3. Get connection string

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Vishva CS** - [@vishva-cs](https://github.com/vishva-cs)

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- Tailwind CSS for styling
- React community

## 📞 Support

For support, email support@writerworld.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Audiobook generation
- [ ] Community forums
- [ ] Writer collaboration tools
- [ ] Blockchain-based royalties
- [ ] International payments (Stripe)

---

**Made with ❤️ by Vishva CS**
