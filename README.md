# 🎬 Movie-Tracker


MovieMinder is a modern web application that helps users track their favorite movies, create watchlists, and discover new films. Built with a robust stack of contemporary technologies, it offers a seamless and interactive experience for movie enthusiasts.

## Features

- User authentication and personalized movie lists
- Search and track movies
- Create and manage watchlists
- Rate and review movies
- Responsive design for all devices
- Real-time updates using GraphQL subscriptions

## 🛠️ Technologies Used

### Frontend
- React.js
- GraphQL (Apollo Client)
- Styled-components for styling
- Progressive Web App (PWA) capabilities

### Backend
- Node.js
- Express.js
- GraphQL (Apollo Server)
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication

### DevOps & Tools
- GitHub Actions for CI/CD
- Render for deployment
- Environment variables for secure configuration
- ESLint & Prettier for code formatting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/movieminder.git
cd movieminder
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create environment variables
```bash
# In server directory, create .env file
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001

# In client directory, create .env file
REACT_APP_GRAPHQL_URI=http://localhost:3001/graphql
```

4. Start the development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd client
npm start
```

## 📱 Screenshots

![Dashboard View](/screenshots/dashboard.png)
*Main dashboard showing movie collections*

![Movie Details](/screenshots/movie-details.png)
*Detailed view of a movie with ratings and reviews*

## 🔐 Security Features

- JWT-based authentication
- Protected API routes
- Secure password hashing
- Environment variables for sensitive data
- CORS protection

## 🌐 API Reference

Our GraphQL API provides the following main queries and mutations:

```graphql
# Example Queries
query GetMovies {
  movies {
    id
    title
    description
    rating
  }
}

# Example Mutations
mutation AddMovie($input: MovieInput!) {
  addMovie(input: $input) {
    id
    title
    success
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Deployed Application

Visit the live application: [MovieMinder App](https://movie-tracker-c1w4.onrender.com)

## ✨ Acknowledgments
- Team Members: Matt, Amar, Branden, JL

- Movie data provided by [TMDB API](https://www.themoviedb.org/documentation/api)
- Icons from [Heroicons](https://heroicons.com)
- Deployment platform: [Render](https://render.com)****
