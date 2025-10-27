# Social Feed API - Setup Guide

A Twitter-like social media backend API built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Redis (for caching and rate limiting)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Database
MONGO_DB_URL=mongodb://localhost:27017/social-feed-
DATABASE_NAME = barnksforte

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Internal Service Key (for client validation)
INTERNAL_SERVICE_KEY=your_internal_service_key_here

# Server
PORT=5200
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `MONGO_DB_URL`: MongoDB connection string (default: mongodb://localhost:27017/social-feed-api)
- `REDIS_URL`: Redis connection string (default: redis://localhost:6379)
- `JWT_SECRET`: Secret key for JWT token signing
- `INTERNAL_SERVICE_KEY`: Key for internal service authentication
- `CORS_ORIGIN`: Allowed CORS origin for frontend (default: http://localhost:3000)
- `PORT`: Server port (default: 5200)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

### Authentication
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - User login

### User Management
- `PUT /v1/user/:id/password` - Change password
- `POST /v1/user/:id/posts` - Create post
- `GET /v1/user/:id/posts` - Get user's posts
- `GET /v1/user/:id/posts/:postId` - Get specific post
- `DELETE /v1/user/:id/posts/:postId` - Delete post
- `GET /v1/user/:id/shared-posts` - Get shared posts

## Usage

1. **Start the server**: `npm run dev`
2. **Health check**: Visit `http://localhost:5200/health`
3. **API base URL**: `http://localhost:5200/v1`

## Scripts

- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev**: `npm run dev` (with auto-reload)