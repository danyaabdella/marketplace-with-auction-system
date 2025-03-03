import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    merchantId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    description: String,
    condition: { type: String, enum: [ 'new', 'used']},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    itemImg: [{ type: String }],
    startingPrice: {type: Number, required: true},
    reservedPrice: {type: Number, required: true},
    bidIncrement: Number,
    status: {type: String, enum: [  'active', 'ended', 'cancelled']},
    adminApproval: {type: String, enum: [ 'pending', 'approved', 'rejected'], default: 'pending'},
    paymentduration: { type: Date },
    quantity: {type: Number, default: 1},

})
const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
export default Auction;