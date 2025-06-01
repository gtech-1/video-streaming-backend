import mongoose, { Schema } from "mongoose";

export interface AuthUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    photoUrl: string;
    address: string;
    phone: string;
    dob: Date;
    socialMedia: {
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
    };
    courses: Array<{
        id: number;
        name: string;
        progress: number;
    }>;
    loginActivity: {
        firstLogin: Date;
        lastLogin: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const authUserSchema = new Schema<AuthUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    address: {
        type: String,
        default: "Not provided"
    },
    phone: {
        type: String,
        default: "Not provided"
    },
    dob: {
        type: Date,
        default: null
    },
    socialMedia: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" }
    },
    courses: [{
        id: Number,
        name: String,
        progress: Number
    }],
    loginActivity: {
        firstLogin: { type: Date, default: Date.now },
        lastLogin: { type: Date, default: Date.now }
    }
}, {
    timestamps: true
});

export default mongoose.model<AuthUser>("authUser", authUserSchema); 