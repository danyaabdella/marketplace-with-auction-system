import { connectToDB, userInfo } from '@/libs/functions'
import Notification from '@/models/Notification'
import { NextResponse } from 'next/server'

// GET: Fetch all notifications for the current user
export async function GET(req) {
    try {
        await connectToDB()
        const user = userInfo(req)
        
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const notifications = await Notification.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(50)

        const unreadCount = await Notification.countDocuments({
            userId: user.id,
            read: false
        })

        return NextResponse.json({
            notifications,
            unreadCount
        })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            { message: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

// POST: Mark notifications as read
export async function POST(req) {
    try {
        await connectToDB()
        const user = userInfo(req)
        
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { ids } = await req.json()

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json(
                { message: 'Invalid request body' },
                { status: 400 }
            )
        }

        await Notification.updateMany(
            {
                _id: { $in: ids },
                userId: user.id
            },
            { $set: { read: true } }
        )

        return NextResponse.json({ message: 'Notifications marked as read' })
    } catch (error) {
        console.error('Error marking notifications as read:', error)
        return NextResponse.json(
            { message: 'Failed to mark notifications as read' },
            { status: 500 }
        )
    }
}

// DELETE: Delete notifications
export async function DELETE(req) {
    try {
        await connectToDB()
        const user = userInfo(req)
        
        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { ids } = await req.json()

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json(
                { message: 'Invalid request body' },
                { status: 400 }
            )
        }

        await Notification.deleteMany({
            _id: { $in: ids },
            userId: user.id
        })

        return NextResponse.json({ message: 'Notifications deleted successfully' })
    } catch (error) {
        console.error('Error deleting notifications:', error)
        return NextResponse.json(
            { message: 'Failed to delete notifications' },
            { status: 500 }
        )
    }
} 