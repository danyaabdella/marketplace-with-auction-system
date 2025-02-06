import mongoose from 'mongoose'

const bidSchema = new mongoose.Schema({
    
    auctionId: {type: mongoose.Schema.Types.ObjectId, required: true},
    bids: [{
        bidderEmail: {type: String, required: true},
        bidderName: {type: String, required: true},
        bidAmount: {type: Number, required: true},
        bidTime: {type: Date, default: new Date},
    }],
    highestBid: { type: Number, default: 0 }, 
    highestBidderEmail: { type: String }

});

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema)
export default Bid;