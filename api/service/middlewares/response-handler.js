// The Response Handler middleware will standardize the format of all responses

const responseHandler = (req, res, next) => {
    // Override the res.send method
    const originalSend = res.send;

    res.send = (body) => {
        // Parse the response body
        if (typeof body === "string") {
            try {
                body = JSON.parse(body);
            } catch (e) {
                body = { message: body }; // In case it's a plain string
            }
        }

        // Standardized response format
        const response = {
            status: res.statusCode || 200,
            message: body.message || "Success",
            data: body.data || {},
        };

        // Send the standardized response
        originalSend.call(res, JSON.stringify(response));
    };

    next();
};

export default responseHandler;
