import { isValidObjectId } from "mongoose";

// Middleware to validate ObjectId
export const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    // If there's an 'id' in the params, check if it's valid
    if (id && !isValidObjectId(id) && id!=='profile') {
        return res.status(400).send({
            message: "Invalid ID format",
            data: null,
        });
    }

    next();
};
