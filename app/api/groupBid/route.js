import GroupBid from '@/models/GroupBid';
import { connectToDB } from '@/libs/functions';
import { sendEmail } from '@/libs/sendEmail';


export async function POST(req) {
    try {
        await connectToDB();

        const { auctionId, teamLeaderEmail, teamMembers } = await req.json();

        // Validate input
        if (!auctionId || !teamLeaderEmail || !teamMembers || teamMembers.length === 0) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }

        // Create a new group bid
        const groupBid = new GroupBid({
            auctionId,
            teamLeaderEmail,
            teamMembers,
        });

        // Save the group bid to the database
        await groupBid.save();

        // Send invitations to team members
        teamMembers.forEach(member => {
            sendEmail(
                member.email,
                'Invitation to Join Group Bid',
                `You have been invited to join a group bid by ${teamLeaderEmail}. Please accept or reject the invitation.`
            );
        });

        return new Response(
            JSON.stringify({ message: 'Group bid created successfully', groupBid }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Failed to create group bid', error: error.message }),
            { status: 500 }
        );
    }
}
export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const groupBidId = searchParams.get('groupBidId');

        if (!groupBidId) {
            return new Response(
                JSON.stringify({ message: 'Group bid ID is required' }),
                { status: 400 }
            );
        }

        const groupBid = await GroupBid.findById(groupBidId);

        if (!groupBid) {
            return new Response(
                JSON.stringify({ message: 'Group bid not found' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Group bid fetched successfully', groupBid }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Failed to fetch group bid', error: error.message }),
            { status: 500 }
        );
    }
}
export async function PUT(req) {
    try {
        await connectToDB();

        const { groupBidId, memberEmail, status } = await req.json();

        // Validate input
        if (!groupBidId || !memberEmail || !status) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }

        // Find the group bid
        const groupBid = await GroupBid.findById(groupBidId);

        if (!groupBid) {
            return new Response(
                JSON.stringify({ message: 'Group bid not found' }),
                { status: 404 }
            );
        }

        // Find the team member and update their status
        const member = groupBid.teamMembers.find(member => member.email === memberEmail);

        if (!member) {
            return new Response(
                JSON.stringify({ message: 'Team member not found' }),
                { status: 404 }
            );
        }

        member.status = status; // Update the status to 'accepted' or 'rejected'
        await groupBid.save();
        
        // const allAccepted = groupBid.teamMembers.every(member => member.status === 'accepted');
        // if (allAccepted) {
        //     groupBid.status = 'active'; // Activate group bid
        //     await groupBid.save();
        // }
        // Notify the team leader about the member's response
        sendEmail(
            groupBid.teamLeaderEmail,
            'Team Member Response',
            `Team member ${memberEmail} has ${status} the invitation.`
        );

        return new Response(
            JSON.stringify({ message: 'Group bid updated successfully', groupBid }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Failed to update group bid', error: error.message }),
            { status: 500 }
        );
    }
}
export async function DELETE(req) {
    try {
        await connectToDB();

        const { groupBidId } = await req.json();

        // Validate input
        if (!groupBidId) {
            return new Response(
                JSON.stringify({ message: 'Group bid ID is required' }),
                { status: 400 }
            );
        }

        // Find and delete the group bid
        const groupBid = await GroupBid.findByIdAndDelete(groupBidId);

        if (!groupBid) {
            return new Response(
                JSON.stringify({ message: 'Group bid not found' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Group bid deleted successfully' }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Failed to delete group bid', error: error.message }),
            { status: 500 }
        );
    }
}