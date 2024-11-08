"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const policeController_1 = require("../controllers/policeController");
const router = express_1.default.Router();
router.get('/all', async (req, res) => {
    try {
        await (0, policeController_1.getAllPolice)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
router.get('/nearest', async (req, res) => {
    try {
        await (0, policeController_1.findNearestPolice)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.default = router;
