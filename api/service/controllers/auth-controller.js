import { authenticateUser } from "../services/auth-service.js";
import { generateToken } from "../utils/jwt-verify.js";

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call the service to authenticate the user
        const user = await authenticateUser(email, password);
        if(!user.is_verified) {
            return res.status(403).send({ message: "Email not verified Please verify Email" });
        }

        // Generate JWT token for the authenticated user
        const token = generateToken(user);

        // Return success response with token
        res.status(200).send({
            message: "Login successful",
            data: { token },
        });
    } catch (error) {
        res.status(error.statusCode).send({
            message: error.message,
        });
    }
};
