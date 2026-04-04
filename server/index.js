import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Database Connection
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
import contactPageRoutes from './routes/contactPageRoutes.js'; // FAQ & Map Settings
import jobRoutes from './routes/jobRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import aboutSnippetRoutes from './routes/aboutSnippetRoutes.js';
import statRoutes from './routes/statRoutes.js';
import mapSettingRoutes from './routes/mapSettingRoutes.js';
dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static Folders for Uploads (Images/PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Home & About Sections
app.use('/api/hero-sliders', heroRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/vision-mission', visionRoutes);
app.use('/api/chairman-message', chairmanRoutes);

// Team & Governance
app.use('/api/board-members', boardRoutes);
app.use('/api/committees', committeeRoutes); 
app.use('/api/programmes', programmeRoutes);

// Products & Content
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);

// Footer & Global Links
app.use('/api/footer-links', footerRoutes);

// Contact Page & Location
app.use('/api/contact-info', contactRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/map-location', mapRoutes);
app.use('/api/contact-page-settings', contactPageRoutes); // FAQ & Map Embed
app.use('/api/map-settings', mapSettingRoutes); // New Map Settings Route
// Careers & Investor Relations
app.use('/api/jobs', jobRoutes);
app.use('/api/documents', documentRoutes);

app.use('/api/about-snippet', aboutSnippetRoutes);


// ... existing code ...

app.use('/api/stats', statRoutes);

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