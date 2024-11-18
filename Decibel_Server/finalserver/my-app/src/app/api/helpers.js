import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    if (!client.isConnected) {
      await client.connect();
      console.log("Connected to MongoDB");
    }
    return client.db("pretopgun-day2").collection("machine_data");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection error");
  }
}

export async function connectToPredictionDatabase() {
  try{
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  }catch(error){
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection error");
  }
}


export function authenticateToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.error("No Authorization header provided");
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Invalid token format");
    throw new Error("Token format is incorrect");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Token is invalid or expired");
  }
}
