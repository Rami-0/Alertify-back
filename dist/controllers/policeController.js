"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearestPolice = exports.getAllPolice = void 0;
const client_1 = require("@prisma/client");
const calculateDistance_1 = require("../utils/calculateDistance");
const prisma = new client_1.PrismaClient();
const getAllPolice = async (req, res) => {
    try {
        const policeOfficers = await prisma.police.findMany({
            include: { position: true }
        });
        res.status(200).json(policeOfficers);
    }
    catch (error) {
        console.error("Error fetching police data:", error);
        res.status(500).json({ message: "Error fetching police data." });
    }
};
exports.getAllPolice = getAllPolice;
const findNearestPolice = async (req, res) => {
    const { lat, lng, count = 5 } = req.query; // 'count' is the number of nearest police officers to return
    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required." });
    }
    const myLocation = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
    };
    try {
        // Fetch police officers with their position data
        const policeOfficers = await prisma.police.findMany({
            include: { position: true }
        });
        // Calculate distance and filter the nearest police officers
        const nearestPolice = policeOfficers
            .map((officer) => {
            const distance = (0, calculateDistance_1.calculateDistance)(myLocation.lat, myLocation.lng, officer.position.latitude, officer.position.longitude);
            return { ...officer, distance }; // Add distance to officer object
        })
            .sort((a, b) => a.distance - b.distance) // Sort by distance
            .slice(0, Number(count)); // Get the nearest 'count' officers
        return res.status(200).json(nearestPolice);
    }
    catch (error) {
        console.error("Error finding nearest police:", error);
        return res.status(500).json({ message: "Error finding nearest police." });
    }
};
exports.findNearestPolice = findNearestPolice;
