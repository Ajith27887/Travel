import express from 'express';
import Destination from '../model/destination.js';
import authhandler from '../middleware/authhandler.js';

const router = express.Router();

// Create new destination (Protected route)
router.post('/', authhandler, async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({
            success: true,
            data: destination
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get all destinations with filters
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, location } = req.query;
        const filter = {};

        // Apply filters if provided
        if (category) filter.category = category;
        if (location) filter['location.country'] = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const destinations = await Destination.find(filter);
        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get single destination
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({
                success: false,
                error: 'Destination not found'
            });
        }
        res.status(200).json({
            success: true,
            data: destination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


export default router;