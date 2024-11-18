import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function connectToDatabase() {
  const client = await clientPromise;
  return client.db('pretopgun-day2').collection('files');
}

export async function PUT(req) {
  try {
    const data = await req.json(); // Parse JSON data from the request body
    const collection = await connectToDatabase();

    if (data.name) {
      // Query by name to return the link
      const result = await collection.findOne(
        { name: data.name },
        { projection: { link: 1, _id: 0 } } // Include only the link field
      );

      if (!result) {
        return new Response(JSON.stringify({ message: 'File not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: 'File found', link: result.link }), { status: 200 });
    }

    if (data.link) {
      // Query by link to return the name
      const result = await collection.findOne(
        { link: data.link },
        { projection: { name: 1, _id: 0 } } // Include only the name field
      );

      if (!result) {
        return new Response(JSON.stringify({ message: 'File not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: 'File found', name: result.name }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Invalid query parameter' }), { status: 400 });
  } catch (error) {
    console.error("Error in PUT:", error);
    return new Response(JSON.stringify({ message: 'Error fetching file', error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const collection = await connectToDatabase();

    // Fetch all documents but exclude the `link` field
    const result = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return new Response(JSON.stringify({ message: 'Error fetching files', error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json(); // Parse JSON data from the request body
    const collection = await connectToDatabase();

    // Insert the new document
    const result = await collection.insertOne(data);

    return new Response(JSON.stringify({ message: 'File uploaded', id: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ message: 'Error uploading file', error: error.message }), { status: 500 });
  }
}
