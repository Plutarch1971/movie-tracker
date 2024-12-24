# MovieTracker 🎬

## Description

MovieTracker is a MERN stack single-page application that allows users to search, track, and manage their favorite movies. Built with modern web technologies, it provides a seamless experience for movie enthusiasts to discover new films and maintain their personal watchlist.

## Features

- User authentication with JWT
- Movie search functionality
- Save favorite movies to personal collection
- Responsive design for mobile and desktop viewing
- Real-time updates using GraphQL
- Secure API key management

## Technologies Used

### Frontend
- React
- Apollo Client for GraphQL
- Styled-components for CSS-in-JS styling
- PWA capabilities

### Backend
- Node.js
- Express.js
- GraphQL
- MongoDB with Mongoose ODM
- JSON Web Tokens for authentication

### DevOps & Deployment
- GitHub Actions for CI/CD
- Render for hosting
- MongoDB Atlas for database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movietracker.git
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MOVIE_API_KEY=your_movie_api_key
```

4. Start the development servers:
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## Usage

1. Create an account or log in to your existing account
2. Search for movies using the search bar
3. Click on a movie to view detailed information
4. Click the heart icon to add/remove movies from your favorites
5. View your favorite movies in the "My Movies" section

## Screenshots

![Homepage](./screenshots/homepage.png)
![Search Results](./screenshots/search.png)
![Favorites Page](./screenshots/favorites.png)

## Database Schema
![image](https://github.com/user-attachments/assets/dc0e1531-1c7e-4cf8-b732-6c0c30749cb6)


## GraphQL API

### Queries
- `me`: Get current user
- `movies`: Search movies
- `movie`: Get single movie by ID

### Mutations
- `login`: Authenticate user
- `addUser`: Create new user
- `addFavorite`: Add movie to favorites
- `removeFavorite`: Remove movie from favorites

## Deployment

The application is deployed on Render. Visit the live site at: [MovieTracker App](https://movietracker.onrender.com)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## GitHub Actions

This project uses GitHub Actions for:
- Automated testing on pull requests
- Linting checks
- Automated deployment to Render on merges to main

## Future Enhancements

- Movie recommendations based on favorites
- Social sharing features
- Watch history tracking
- Movie ratings and reviews
- Integration with streaming service availability

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Matthew Mendez, Branden Camilo, Amar Patel, Jianluo He, Derek Hurteau

Project Link: [https://github.com/yourusername/movietracker](https://github.com/yourusername/movietracker)
