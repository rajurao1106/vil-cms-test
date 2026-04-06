import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// Database Connection Logic (Optimized for Serverless)
import connectDB from './config/db.js';

// Route Imports
import heroRoutes from './routes/heroRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import visionRoutes from './routes/visionRoutes.js';
import chairmanRoutes from './routes/chairmanRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import programmeRoutes from './routes/programmeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import contactPageRoutes from './routes/contactPageRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aboutSnippetRoutes from './routes/aboutSnippetRoutes.js';
import statRoutes from './routes/statRoutes.js';
import mapSettingRoutes from './routes/mapSettingRoutes.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// --- SERVERLESS DB CONNECTION MIDDLEWARE ---
// Yeh ensure karega ki har request se pehle DB connect ho aur connection reuse ho
let isConnected = false;

app.use(async (req, res, next) => {
  if (isConnected) {
    return next();
  }
  try {
    await connectDB(); // Aapka config/db.js wala function
    isConnected = true;
    console.log("Connected to MongoDB (Serverless Mode)");
    next();
  } catch (error) {
    res.status(500).json({ message: "Database Connection Error", error: error.message });
  }
});

// Middlewares
app.use(cors());
app.use(express.json());


// Routes Registration
app.use('/api/hero-sliders', heroRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/vision-mission', visionRoutes);
app.use('/api/chairman-message', chairmanRoutes);
app.use('/api/board-members', boardRoutes);
app.use('/api/committees', committeeRoutes); 
app.use('/api/programmes', programmeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/footer-links', footerRoutes);
app.use('/api/contact-info', contactRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/map-location', mapRoutes);
app.use('/api/contact-page-settings', contactPageRoutes);
app.use('/api/map-settings', mapSettingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/about-snippet', aboutSnippetRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/stats', statRoutes);

app.get("/", (req, res) => {
  res.send("API running perfectly in Next.js environment...");
});

app.listen(1337, ()=>console.log("api is running..."))