import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema({
    fullName: { required: true, type: String },
    email: { 
        unique: true, 
        required: true, 
        type: String, 
        validate: { 
            validator: (v) => /^\S+@\S+\.\S+$/.test(v), 
            message: props => props.value + ' is not a valid email!' 
        } 
    },
    password: { required: true, type: String },
    role: { required: true, type: String, enum: ["customer", "merchant"], default: "customer" },
    image: { type: String, default: " " },
    phoneNumber: { type: Number, required: false },
    address: { 
        stateName: { type: String, required: false }, 
        cityName: { type: String, required: false }, 
    },
    isMerchant: { type: Boolean, default: false }, 
    merchantDetail: {
        businessName: { type: String, required: function() { return this.role === 'merchant'; } },
        tinNumber: { type: String, required: function() { return this.role === 'merchant'; } },
        nationalId: { type: String, required: function() { return this.role === 'merchant'; } },
        isVerified: { type: Boolean, default: false },
    },
});

const User = models?.User || mongoose.model("User", UserSchema);
export default User;
