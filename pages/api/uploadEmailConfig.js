import nextCors from "nextjs-cors";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import mime from 'mime-types'; // Import mime-types for file type validation

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

// Utility to parse formidable forms
const parseForm = (req) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory at ${uploadDir}`);
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Formidable parsing error:", err.message, err.stack);
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default async function handler(req, res) {
  // Apply CORS middleware
  await nextCors(req, res, {
    // Allow all origins during development; adjust for production
    origin: "https://email-template-maker-w5ag-fisfaeq4h-46-debugs-projects.vercel.app/",
    methods: ["POST", "GET", "OPTIONS"],
    optionsSuccessStatus: 200, // Handle older browsers (legacy CORS support)
  });

  if (req.method === "POST") {
    try {
      // Parse the form data
      const { fields, files } = await parseForm(req);

      // Extract fields and file paths
      const {
        title,
        description,
        footer,
        lShape,
        fSize,
        fColor,
        fAlignment,
        tSize,
        tColor,
        tAlignment,
        ftSize,
        ftColor,
        ftAlignment,
      } = fields;

      const logo = files.logo && files.logo.newFilename ? `/uploads/${files.logo.newFilename}` : null;
      const image = files.image && files.image.newFilename ? `/uploads/${files.image.newFilename}` : null;

      // Validate file types
      if (files.logo) {
        const logoMimeType = mime.lookup(files.logo.originalFilename);
        if (!logoMimeType || !logoMimeType.startsWith('image/')) {
          return res.status(400).json({ error: 'Invalid logo file type' });
        }
      }

      if (files.image) {
        const imageMimeType = mime.lookup(files.image.originalFilename);
        if (!imageMimeType || !imageMimeType.startsWith('image/')) {
          return res.status(400).json({ error: 'Invalid image file type' });
        }
      }

      // MongoDB connection
      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = client.db("EMAIL_BUILDER");
      const collection = db.collection("template");

      // Check for an existing template and update or insert
      const latestTemplate = await collection
        .find()
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      let result;
      if (latestTemplate.length > 0) {
        result = await collection.updateOne(
          { _id: latestTemplate[0]._id },
          {
            $set: {
              title,
              description,
              footer,
              lShape,
              logo,
              image,
              fSize,
              fColor,
              fAlignment,
              tSize,
              tColor,
              tAlignment,
              ftSize,
              ftColor,
              ftAlignment,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        result = await collection.insertOne({
          title,
          description,
          footer,
          lShape,
          logo,
          image,
          fSize,
          fColor,
          fAlignment,
          tSize,
          tColor,
          tAlignment,
          ftSize,
          ftColor,
          ftAlignment,
          createdAt: new Date(),
        });
      }

      await client.close();

      // Respond with success
      res.status(200).json({
        message: "Template saved/updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in handler:", error.message, error.stack);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}