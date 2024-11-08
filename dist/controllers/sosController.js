"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSos = async (req, res) => {
    const { uid, lat, lng, contacts, email } = req.body;
    console.log(req.body);
    try {
        const user = await prisma.users.findUnique({ where: { id: parseInt(uid) } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newSos = await prisma.sOS.create({
            data: {
                lat,
                lng,
                contacts: user.phoneNumber,
                email: email || user.email,
                isConfirmed: true
            }
        });
        res.status(201).json({ message: "SOS created successfully!", sos: newSos });
    }
    catch (error) {
        console.error("Error creating SOS:", error);
        res.status(500).json({ message: "Error creating SOS." });
    }
};
exports.createSos = createSos;
