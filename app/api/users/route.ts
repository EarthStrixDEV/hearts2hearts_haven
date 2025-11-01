import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE_PATH = path.join(process.cwd(), 'cms-data', 'users.json');

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

// GET - Read all users (excluding passwords)
export async function GET() {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    const users: User[] = JSON.parse(fileContent);
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    return NextResponse.json(usersWithoutPasswords, { status: 200 });
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json(
      { error: 'Failed to read users data' },
      { status: 500 }
    );
  }
}

// POST - Login authentication
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(USERS_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Users data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    const users: User[] = JSON.parse(fileContent);

    // Find user by username
    const user = users.find(u => u.username === username);

    if (!user) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error authenticating user:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
}

