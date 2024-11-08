"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    // Set default status code to 500 if not set in the error
    const statusCode = err.status || 500;
    // Send a response with the error message and status code
    res.status(statusCode).json({
        message: err.message || "Something went wrong",
        // Optionally include the stack trace for development (remove in production)
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.default = errorMiddleware;
