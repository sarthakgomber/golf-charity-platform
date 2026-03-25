# Golf Charity Subscription Platform - Backend

This is the backend API for the Golf Charity Subscription Platform.

## Features

- User authentication (register, login, logout)
- Subscription management
- Score tracking (with automatic 5-score retention)
- Charity integration
- Draw and reward system
- Admin dashboard
- Winner verification system

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Nodemailer for emails

## Getting Started

### Prerequisites

- Node.js >= 14.x
- MongoDB instance (local or cloud)
- Stripe account for payment processing

### Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file based on `.env.example`
4. Run `npm run dev` to start the development server

### Environment Variables

Create a `.env` file with the following variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email address
- `EMAIL_PASS` - Email password

### Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run data:import` - Import seed data
- `npm run data:destroy` - Destroy seed data

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/dashboard` - Get user dashboard
- `PUT /api/users/profile` - Update user profile

### Scores
- `GET /api/scores` - Get user scores
- `POST /api/scores` - Add new scores

### Charities
- `GET /api/charities` - Get all charities
- `GET /api/charities/:id` - Get charity by ID

### Admin
- `GET /api/admin/stats` - Get admin stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/charities` - Create new charity

## Folder Structure

- `/src/controllers` - Request handlers
- `/src/models` - Database models
- `/src/routes` - API routes
- `/src/middleware` - Custom middleware
- `/src/services` - Business logic
- `/src/utils` - Helper functions
- `/src/config` - Configuration files
- `/src/seeders` - Seed data scripts

## License

This project is licensed under the MIT License.
