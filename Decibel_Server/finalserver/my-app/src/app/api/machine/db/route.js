import { NextResponse } from 'next/server';
import { connectToDatabase, authenticateToken } from '@/app/api/helpers';

export async function GET(request) {
  try {

    authenticateToken(request); // Check if the user is authenticated
    const collection = await connectToDatabase();
    const data = await collection.find({}).toArray();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve data:", error);
    return NextResponse.json({ message: 'Failed to insert data or no authen', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {

      const data = await request.json();
      const collection = await connectToDatabase();
      const result = await collection.insertOne(data);
  
      return NextResponse.json({ message: 'Data inserted successfully', insertedId: result.insertedId }, { status: 201 });
    } catch (error) {
      console.error("Failed to insert data:", error);
      return NextResponse.json({ message: 'Failed to insert data', error: error.message }, { status: 500 });
    }
  }

// //delete all 
export async function DELETE(request) {
  try {
    authenticateToken(request); // Check if the user is authenticated
    const collection = await connectToDatabase();
    const result = await collection.deleteMany({});
    return NextResponse.json({ message: 'Data deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

