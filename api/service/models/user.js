import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserApplicationMapping from "./user-application-mapping.js";
import Application from "./application.js";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email address",
            ],
        },
        first_name: {
            type: String,
            required: [true, "First name is required"],
            minlength: [2, "First name should be at least 2 characters long"],
            maxlength: [50, "First name can't exceed 50 characters"],
            trim: true,
        },
        last_name: {
            type: String,
            required: [true, "Last name is required"],
            minlength: [2, "Last name should be at least 2 characters long"],
            maxlength: [50, "Last name can't exceed 50 characters"],
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "user", "moderator"],
            default: "user",
        },
        user_type: {
            type: String,
            enum: ["free", "paid"],
            default: "free",
        },
        hashed_password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        last_login: {
            type: String,
            default: null,
        },
        joinedDate: {
            type: String,
            default: null,
        },
        profilePictureUrl: {
            type: String,
            default: "", // Default profile picture URL
        },
        coverPictureUrl: {
            type: String,
            default: "", // Default cover picture URL
        },
        contactInfo: {
            type: String,
            default: "",
        },
        about: {
            type: String,
            default: "",
        },
        organizationHierarchy: {
            type: String,
            default: "",
        },
        manager_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // Null if the user has no manager
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Hash password before saving user document
userSchema.pre("save", async function (next) {
    if (this.isModified("hashed_password")) {
        const salt = await bcrypt.genSalt(10);
        this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
    }
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.hashed_password);
};

userSchema.pre("deleteOne", async function (next) {
    try {
        // Step 1: Find all UserApplicationMapping entries where the `owner_id` is the current user's _id
        const userMappings = await UserApplicationMapping.find({ owner_id: this._id });
        await UserApplicationMapping.deleteMany({ user_id: this._id });

        // If no mappings are found, skip the next steps
        if (userMappings.length === 0) {
            return next();
        }

        // Step 2: Collect all the application IDs that the user owns
        const applicationIds = userMappings.map(mapping => mapping.application_id);

        // Step 3: Delete all applications that the user owns
        await Application.deleteMany({ _id: { $in: applicationIds } });

        // Proceed to the next middleware or operation (delete the user)
        next();
    } catch (error) {
        // Handle error if any step fails
        next(error);
    }
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
