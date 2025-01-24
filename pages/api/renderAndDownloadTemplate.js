import { MongoClient } from 'mongodb';
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  // Enable CORS for this route
  await NextCors(req, res, {
    methods: ['GET'], // Allowed methods
    origin: '*', // Allow all origins (restrict this in production for security)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  });

  if (req.method === 'GET') {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("EMAIL_BUILDER");
    const collection = db.collection("template");

    try {
      const templates = await collection.find({}).toArray();
      res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
