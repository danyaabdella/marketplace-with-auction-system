import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['buyer', 'seller'],
        default: 'buyer' 
      },
    image: { type: String, default: " " },
    isSeller: { type: Boolean, default: false },
    approvedBy: { type: String, required: false },
    bannedBy: { type: String, required: false },
    tinNumber: { type: String, required: false },
    nationalId: { type: String, required: false },
    isBanned: { type: Boolean, default: false },

    stateName: { type: String, required: false },
    cityName: { type: String, required: false },
    phoneNumber: { type: String, required: false },

    isDeleted: { type: Boolean, default: false }, 
    trashDate: { 
      type: Date, 
      default: null, 
      expires: 30 * 60 * 60 * 60, // Automatically delete after 30 days
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
