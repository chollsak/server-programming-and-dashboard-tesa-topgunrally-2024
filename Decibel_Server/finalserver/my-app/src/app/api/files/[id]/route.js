import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function connectToDatabase() {
  const client = await clientPromise;
  return client.db('pretopgun-day2').collection('files');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract `id` from the request URL
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }

      const collection = await connectToDatabase();

      // Query MongoDB with `ObjectId`
      const result = await collection.findOne({ _id: new ObjectId(id) });

      if (!result) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.status(200).json({ message: 'File found', data: result });
    } catch (error) {
      console.error("Error in GET:", error);
      res.status(500).json({ message: 'Error fetching file', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
