import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { username, password } = await request.json();

  // Replace this with actual user authentication
  if (username === 'topgunday2' && password === 'topgunday2') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
