import {generateToken, verifyToken} from "../utils/jwt-verify.js";
import { getUserByIdFromDb, getUserByEmailFromDb } from "../services/user-service.js";
import { createUserApplicationMapping } from "../services/application-service.js";

// Email verification
export const verifyEmail = async (req, res) => {
    let { token } = req.query;

    try {
        // Verify the token and extract the user info
        const decoded = verifyToken(token);
        
        // Find the user and mark them as verified
        const user = await getUserByIdFromDb(decoded.id);

        user.is_verified = true;  // Update the user's verification status
        await user.save();
        token=generateToken(user)

        res.status(200).send({ message: "Email verified successfully",data:{token} });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const verifyInvitation = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token and extract the user info
        const decoded = verifyToken(token);
        const { email, applicationId, ownerId, role } = decoded;

        await createUserApplicationMapping(email, applicationId, ownerId, role);

        res.status(200).send({ message: "Invitation accepted successfully" });
        
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
