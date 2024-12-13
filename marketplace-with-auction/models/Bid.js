import mongoose from 'mongoose'

const bidSchema = new mongoose.Schema({
    bidId: {type: string, unique: true},
    auctionId: {type: string, required: true},
    customerId: {type: string, required:true},
    amount: {type: float, required: true},
    bidTime: time,
});

const Bid = mongoose.model.Bid || mongoose.models('Bid', bidSchema)
export default Bid;