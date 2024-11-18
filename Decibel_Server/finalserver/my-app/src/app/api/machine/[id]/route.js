import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { connectToDatabase, authenticateToken } from '@/app/api/helpers';


export async function GET(request, { params }) {
  try {
    authenticateToken(request); // Check if the user is authenticated

    const collection = await connectToDatabase();
    const data = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!data) return NextResponse.json({ message: 'Data not found' }, { status: 404 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    authenticateToken(request); // Check if the user is authenticated
    const id = await params.id;
    const collection = await connectToDatabase();
    const updatedData = await request.json();

    const result = await collection.updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'No document was modified' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json({ message: 'Failed to update data', error: error.message }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    authenticateToken(request); // Check if the user is authenticated

    const collection = await connectToDatabase();
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
