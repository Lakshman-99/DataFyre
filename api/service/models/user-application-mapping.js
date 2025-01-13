import mongoose from "mongoose";

const UserApplicationMappingSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        application_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: [String],
            enum: ["view", "add", "edit", "delete"],
            required: true,
        },
        created_at: { type: Date, default: Date.now },
        last_updated_at: { type: Date, default: Date.now },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "last_updated_at" } }
);

const UserApplicationMapping = mongoose.model("UserApplicationMapping", UserApplicationMappingSchema);

export default UserApplicationMapping;