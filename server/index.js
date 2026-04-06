import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// Database Connection
import connectDB from './config/db.js';



dotenv.config();
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());



// ... existing code ...



app.get("/", (req, res) => {
  res.send("API running...");
});
const PORT = process.env.PORT || 1337;

// Only run server in local environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
 
export default app; 