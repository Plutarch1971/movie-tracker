//import type { Request} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

// Verify the token
export const authenticateToken = async ({ req }: any) => {
 // console.log("req:", req);
  // Get the token from the request
  //const token = req.headers.authorization?.split(' ')[1] || '';
  let token = req.body.token || req.query.token || req.headers.authorization
  console.log(token);
  if( req.headers.authorization){
    token = token.split(' ').pop().trim();
  }
  
  // If no token is provided, return an object with null user
  if (!token) {
    console.log('No token provided');
    return req;
  }

  try {
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || 'Test', { maxAge: '2h' });
    
    // Ensure decoded data exists
    if (!decoded?.data) {
      console.log('Invalid token structure');
      return { user: null };
    }

    // Find the user
    const user = await User.findById(decoded.data._id);
    // req.body = decoded.data;
    if (!user) {
      console.log('No user found for the token');
      return { user: null };
    }

    // Return user data
    req.user = user;
    return req;

  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token');
    }

    return { user: null };
  }
};
// Generate Token
export const signToken = (username: string, _id: unknown) => {
  // Create a payload with the user information
  const payload = { username, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY || 'Test'; // Get the secret key from environment variables

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' }
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};

