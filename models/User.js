import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }},
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['customer', 'merchant'],
      default: 'customer' 
    },
    image: { type: String, default: " " },
    isMerchant: { type: Boolean, default: false },
    approvedBy: { type: String, required: false },
    bannedBy: { type: String, required: false },
    tinNumber: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    nationalId: { 
      type: String, 
      required: function() { return this.role === "merchant"; } 
    },
    isBanned: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    stateName: { type: String, required: false },
    cityName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    trashDate: { 
      type: Date,
      default: null,
      expires: 30 * 60 * 60 * 60,
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
