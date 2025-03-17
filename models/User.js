import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true
    }, 
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['customer', 'merchant'],
      default: 'customer' 
    },
    image: { type: String, default: " " },
    isBanned: { type: Boolean, default: false },
    bannedBy: { type: String, required: function() { return this.isBanned === true; } },
    isEmailVerified: { type: Boolean, default: false },
    stateName: { type: String, required: false },
    cityName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    trashDate: { 
      type: Date,
      default: null,
      expires: 30 * 24 * 60 * 60, // 30 days in seconds
    },
    approvalStatus: {     
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: function() { return this.role === "merchant"; } 
    },
    approvedBy: { type: String },
    tinNumber: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    uniqueTinNumber: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    nationalId: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    account_name: {
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    account_number: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    bank_code: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
