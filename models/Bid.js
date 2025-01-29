import mongoose from 'mongoose'

const bidSchema = new mongoose.Schema({
    
    auctionId: {type: mongoose.Schema.Types.ObjectId, required: true},
    bids: [{
        bidderEmail: {type: String, required: true},
        bidderName: {type: String, required: true},
        bidAmount: {type: Number, required: true},
        bidTime: {type: Date, required: true},
    }],
    highestBid: { type: Number, default: 0 }, 
    highestBidderEmail: { type: String }

});

const Bid = mongoose.model.Bid || mongoose.models('Bid', bidSchema)
export default Bid;