import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../services/auth.js";
import { BookDocument } from "../models/Book.js";



interface UserLogin {
 username: string;
  password: string;
}
interface UserSignup {
  username: string;
  password: string;
}
interface BookData {
  bookData: BookDocument;
}

export const resolvers = {
  Query: {
     },
  

  Mutation: {
   
   
}
export default resolvers;