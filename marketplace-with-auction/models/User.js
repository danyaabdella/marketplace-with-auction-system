import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema({
    fullName: { required: true, type: String },
    email: { unique: true, required: true, type: String },
    password: { required: true, type: String },
    role: { required: true, type: String, default: "Buyer" },
    image: { type: String, default: " "},

    isSeller: { type: Boolean, default: false }, 
    approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    tinNumber: { type: String, required: false },
    nationalId: { type: String, required: false },
    temporarilyBanned: { type: Boolean, default: false }, 
    bannedPermanently: { type: Boolean, default: false },

    stateName: { type: String, required: false }, 
    cityName: { type: String, required: false }, 
    phoneNumber: { type: String, required: false } 
    
});

const User = models?.User || mongoose.model("User", UserSchema);
export default User;

