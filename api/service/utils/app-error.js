class AppError extends Error {
    constructor(message, statusCode) {
        super(message);  // Call the parent constructor (Error)
        this.statusCode = statusCode;  // Attach the status code
        this.isOperational = true; // Optional, to mark as a known error
        Error.captureStackTrace(this, this.constructor);  // Capture stack trace
    }
}

export default AppError;