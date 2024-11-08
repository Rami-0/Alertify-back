"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sosController_1 = require("../controllers/sosController");
const router = express_1.default.Router();
router.post('/create', async (req, res) => {
    try {
        await (0, sosController_1.createSos)(req, res);
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.default = router;
