import express from 'express';
import db from './config/connections';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';

import { expressMiddleware } from '@apollo/server/express$';
import { typeDefs, resolvers } from './schemas/index';
import { authenticateToken } from './services/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Create a new instance of an Apollo server wtih GraphQL schema
const startApolloServer = async () => {

    await server.start(); // Start Apollo Server
    await db; // Connect to MongoDB

    const PORT = process.env.PORT || 3001;
    const app = express();

    app.use(express.urlencoded({ extended: false })) ;
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server,
        {
            context: authenticateToken as any
        }
    ));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist/index.html')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        })
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use Graphl at http://localhost:${PORT}/graphql`);
    });
};

// Call the async function to start the server
startApolloServer();