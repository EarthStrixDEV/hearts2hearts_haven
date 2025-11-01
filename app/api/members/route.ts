import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEMBERS_FILE_PATH = path.join(process.cwd(), 'cms-data', 'members.json');

export interface Member {
  id: string;
  name: string;
  koreanName: string;
  position: string;
  birthYear: number;
  nationality: string;
  traineeYears: string;
  emoji: string;
  color: string;
  backstory: string;
  facts: string[];
  quote: string;
  imageUrl: string;
  quickFact: string;
  icon: string;
}

// GET - Read all members
export async function GET() {
  try {
    if (!fs.existsSync(MEMBERS_FILE_PATH)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(MEMBERS_FILE_PATH, 'utf-8');
    const members: Member[] = JSON.parse(fileContent);
    
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('Error reading members:', error);
    return NextResponse.json(
      { error: 'Failed to read members data' },
      { status: 500 }
    );
  }
}

// POST - Create or update members
export async function POST(request: NextRequest) {
  try {
    const members: Member[] = await request.json();
    
    // Ensure the directory exists
    const dir = path.dirname(MEMBERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the data to file
    fs.writeFileSync(MEMBERS_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Members data saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving members:', error);
    return NextResponse.json(
      { error: 'Failed to save members data' },
      { status: 500 }
    );
  }
}

// PUT - Update a single member
export async function PUT(request: NextRequest) {
  try {
    const updatedMember: Member = await request.json();
    
    if (!fs.existsSync(MEMBERS_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Members data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(MEMBERS_FILE_PATH, 'utf-8');
    let members: Member[] = JSON.parse(fileContent);
    
    const memberIndex = members.findIndex(m => m.id === updatedMember.id);
    
    if (memberIndex === -1) {
      // Add new member
      members.push(updatedMember);
    } else {
      // Update existing member
      members[memberIndex] = updatedMember;
    }
    
    fs.writeFileSync(MEMBERS_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Member updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(MEMBERS_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Members data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(MEMBERS_FILE_PATH, 'utf-8');
    let members: Member[] = JSON.parse(fileContent);
    
    const initialLength = members.length;
    members = members.filter(m => m.id !== memberId);
    
    if (members.length === initialLength) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(MEMBERS_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
