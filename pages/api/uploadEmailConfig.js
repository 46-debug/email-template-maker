import formidable from "formidable";
import fs from "fs";
import { MongoClient } from "mongodb";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Request received at /api/uploadEmailConfig");

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir, // Specify upload directory
      keepExtensions: true, // Keep file extensions
      maxFileSize: 10 * 1024 * 1024, // Max file size (10 MB)
      filename: (name, ext, part) => {
        // Custom file naming logic
        return `${Date.now()}-${part.originalFilename}`;
      },
    });

    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form data:", err);
          return res.status(500).json({ error: "Failed to process form data" });
        }

        console.log("Parsed fields:", fields);
        console.log("Parsed files:", files);

        // Extract form fields
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

        // Extract uploaded file paths
        const logo = files.logo ? `/uploads/${files.logo[0].newFilename}` : null;
        const image = files.image ? `/uploads/${files.image[0].newFilename}` : null;

        // MongoDB client connection
        let client;
        try {
          client = await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
        } catch (dbConnError) {
          console.error("Error connecting to MongoDB:", dbConnError);
          return res.status(500).json({ error: "Failed to connect to MongoDB" });
        }

        const db = client.db("EMAIL_BUILDER");
        const collection = db.collection("template");

        try {
          // Find the most recent template, if exists
          const latestTemplate = await collection.find().sort({ createdAt: -1 }).limit(1).toArray();

          if (latestTemplate.length > 0) {
            // If a latest template exists, update it
            const result = await collection.updateOne(
              { _id: latestTemplate[0]._id }, // Find the latest template by ID
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
                  updatedAt: new Date(), // Optional: timestamp for when updated
                },
              }
            );
            console.log("Template updated in MongoDB:", result);
            res.status(200).json({ message: "Email template updated successfully", data: result });
          } else {
            // If no previous template exists, insert a new one
            const result = await collection.insertOne({
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
              createdAt: new Date(), // New entry timestamp
            });

            console.log("New template saved to MongoDB:", result);
            res.status(201).json({ message: "Email template saved successfully", data: result });
          }
        } catch (dbError) {
          console.error("Error saving to database:", dbError);
          res.status(500).json({ error: "Database operation failed" });
        } finally {
          await client.close();
        }
      });
    } catch (parseError) {
      console.error("Unexpected error during file parsing:", parseError);
      res.status(500).json({ error: "Unexpected error during file parsing" });
    }
  } else {
    console.error(`Unsupported method: ${req.method}`);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
