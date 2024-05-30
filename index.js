import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js'; 
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';

dotenv.config();

// Initialize express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Environment variables
const url = process.env.URL;
const port = process.env.PORT;

// Use routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);

// Connect to MongoDB
mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect", err.message));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
