import { NextResponse } from "next/server";
import { connectToPredictionDatabase } from "@/app/api/helpers";

export async function POST(request) {
  try {
    // Proceed with saving data to MongoDB
    const client = await connectToPredictionDatabase();
    const db = client.db();
    const collection = db.collection("predict_result");
    const data = await request.json();
    const result = await collection.insertOne(data);
    return NextResponse.json({ message: "Data inserted successfully", insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await connectToPredictionDatabase();
    const db = client.db();
    const collection = db.collection("predict_result");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}


//delete all
export async function DELETE(request) {
  try {
    const client = await connectToPredictionDatabase();
    const db = client.db();
    const collection = db.collection("predict_result");
    const result = await collection.deleteMany({});
    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}