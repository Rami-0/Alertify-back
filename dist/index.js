"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// console.log(process.env.FRONTEND_URL);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Hello Server");
});
app.use("/users", userRoutes_1.default);
// Middleware
app.use(errorHandler_1.default);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
