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
    totalQuantity: {type: Number, default: 1},
    remainingQuantity: { type: Number },  // Remaining quantity available
    buyByParts: { type: Boolean, default: false },  // If true, allow partial bidding

}, {timestamps: true})


auctionSchema.pre('save', function(next) {
    if (this.isNew) {
        this.remainingQuantity = this.totalQuantity;  // Initialize remaining quantity
    }
    next();
});

auctionSchema.index({ merchantId: 1, startTime: 1 }); 
const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
export default Auction;