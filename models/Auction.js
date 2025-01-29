import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    description: string,
    condition: { type: string, enum: [ 'new', 'used']},
    startTime: {type: Date, default: Date.now, required: true},
    endTime: {type: Date, required: true},
    itemImg: [{ type: string }],
    startingPrice: {type: float, required: true},
    reservedPrice: {type: float, required: true},
    bidIncrement: float,
    status: {type: String, enum: [ 'requested', 'active', 'ended', 'cancelled'], default: 'requested'},
    

})
const Auction = mongoose.model.Auction || mongoose.models('Auction', auctionSchema);
export default Auction;