import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './Service/auth.js';
import db from './config/connection.js';
import APIRouter from './Routes/api/movieTrackRoute.js';
import router from './Routes/ourAPI_Routes.js';

// Load environment variables
dotenv.config();

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
const corsOptions = {
    origin: [clientUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Combined server startup
const startServer = async () => {
    // Start Apollo Server
    await server.start();
    
    // Connect to MongoDB
    await db;

    // Middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Basic logging middleware
    app.use((req: Request, _res: Response, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    // GraphQL endpoint
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken as any
    }));

    // REST API Routes
    app.use('/api/movies', APIRouter);
    app.use('/our-api/movies', router);

    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
        const buildPath = path.join(__dirname, '../client/dist');
        app.use(express.static(buildPath));
        
        // Handle frontend routes
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }

    // Error handling middleware
    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });

    // Handle 404 for API routes
    app.use('/api/*', (_req: Request, res: Response) => {
        res.status(404).json({ error: 'Not Found' });
    });

    // Start server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Accepting requests from: ${clientUrl}`);
        console.log(`Use GraphQL at http://localhost:${port}/graphql`);
    });
};

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
});

export default app;
