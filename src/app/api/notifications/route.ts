import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const notifications = await Database.getNotifications();

    return NextResponse.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    console.error('API /api/notifications GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const notification = await Database.addNotification(title, message, type || 'info');

    return NextResponse.json(
      {
        success: true,
        data: notification,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/notifications POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}
