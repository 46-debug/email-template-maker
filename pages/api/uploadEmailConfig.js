import nextCors from "nextjs-cors";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

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
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // Max file size (10 MB)
    filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`, // Custom file naming
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Formidable file parsing error:", err.message, err.stack);
        reject(err);
      }
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  try {
    // Apply CORS
    await nextCors(req, res, {
      origin: "*",
      methods: ["POST", "GET", "OPTIONS"],
      optionsSuccessStatus: 200,
    });

    if (req.method === "POST") {
      const { fields, files } = await parseForm(req);

      const logo = files.logo && files.logo.newFilename ? `/uploads/${files.logo.newFilename}` : null;
      const image = files.image && files.image.newFilename ? `/uploads/${files.image.newFilename}` : null;

      console.log("Logo path:", logo);
      console.log("Image path:", image);

      // MongoDB logic here...

      res.status(200).json({ message: "Template saved/updated successfully" });
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in handler:", error.message, error.stack);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
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


    if (!logo && files.logo) {
      console.error("File upload issue: 'logo' file is missing 'newFilename'");
    }

    if (!image && files.image) {
      console.error("File upload issue: 'image' file is missing 'newFilename'");
    }

    if (!files.logo && !files.image) {
      console.error("No files uploaded.");
    }

    if (files.logo && !fs.existsSync(path.join(uploadDir, files.logo.newFilename))) {
      console.error("Uploaded 'logo' file does not exist:", files.logo.newFilename);
    }

    if (files.image && !fs.existsSync(path.join(uploadDir, files.image.newFilename))) {
      console.error("Uploaded 'image' file does not exist:", files.image.newFilename);
    }

    form.on('error', (err) => {
      console.error('Formidable error occurred:', err.message);
    });

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
    console.error("Error in handler:", error.massage, error.stack);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
} else {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

