// src/app/api/machine/history/route.js

import { connectToDatabase } from '../../helpers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    const db = await connectToDatabase();

    const results = await db
      .find({
        timestamp: {
          $gte: start,
          $lte: end
        }
      })
      .sort({ timestamp: -1 })
      .toArray();

    // Transform the data to match the expected structure
    const formattedResults = results.map(doc => ({
      timestamp: doc.timestamp.toISOString(),
      Energy_Consumption: {
        Power: doc.Energy_Consumption?.Power || 0
      },
      Pressure: doc.Pressure || 0,
      Force: doc.Force || 0,
      Position_of_the_Punch: doc.Position_of_the_Punch || 0,
      _id: doc._id.toString()
    }));

    return NextResponse.json(formattedResults);
    
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}