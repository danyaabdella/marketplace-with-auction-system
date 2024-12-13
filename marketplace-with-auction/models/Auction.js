import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
    auctionId: string,
    itemName: {type: string, required: true},
    itemDescription: string,
    condition: { type: string, enum: [ 'new', 'used']},
    itemImg: [{ type: string }],
    startingPrice: {type: float, required: true, unique: true},
    reservedPrice: {type: float, required: true},
    bidIncrement: float,

})
const Auction = mongoose.model.Auction || mongoose.models('Auction', auctionSchema);
export default Auction;