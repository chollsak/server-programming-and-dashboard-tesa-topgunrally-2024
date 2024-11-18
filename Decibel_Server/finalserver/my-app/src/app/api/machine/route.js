import { NextResponse } from 'next/server';
import { connectToDatabase, authenticateToken } from '@/app/api/helpers';

export async function POST(request) {
  try {
    authenticateToken(request); // Check if the user is authenticated

    const data = await request.json();
    const collection = await connectToDatabase();
    const result = await collection.insertOne(data);

    return NextResponse.json({ message: 'Data inserted successfully', insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
