import mongoose from 'mongoose'

const bidSchema = new mongoose.Schema({
    
    auctionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    bids: [{
        bidderEmail: { type: String, required: true },
        bidderName: { type: String, required: true },
        quantity: { type: Number, required: true },
        bidAmount: { type: Number, required: true },
        bidTime: { type: Date, default: new Date },
        isGroupBid: { type: Boolean, default: false }, // Indicates if this is a group bid
        groupBidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Reference to the group bid
    }],
    highestBid: { type: Number, default: 0 }, 
    highestBidderEmail: { type: String }

}, { timestamps: true});

bidSchema.pre('save', function (next) {
    if (this.bids.length > 0) {
        const highest = this.bids.reduce((max, bid) => bid.bidAmount > max.bidAmount ? bid : max, this.bids[0]);
        this.highestBid = highest.bidAmount;
        this.highestBidderEmail = highest.bidderEmail;
    }
    next();
});

bidSchema.index({ auctionId: 1, highestBid: -1 });

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema)
export default Bid;