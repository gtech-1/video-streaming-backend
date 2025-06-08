import mongoose, { Document, Schema } from "mongoose";

// 1. Interface for your user data
export interface AuthUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string; 
    status?: string;
    photoUrl: string;
    address: string;
    phone: string;
    dob: Date | null;
    userType:string;
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

export interface AuthUserDocument extends AuthUser, Document {}

const authUserSchema = new Schema<AuthUserDocument>({
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
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    socialMedia: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" }
    },
    courses: [
        {
            id: Number,
            name: String,
            progress: Number
        }
    ],
    loginActivity: {
        firstLogin: { type: Date, default: Date.now },
        lastLogin: { type: Date, default: Date.now }
    }
}, {
    timestamps: true
});

// 3. Export with proper typing
export default mongoose.model<AuthUserDocument>("authUser", authUserSchema);
