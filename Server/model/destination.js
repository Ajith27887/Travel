import mongoose from "mongoose";

const DestinationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Destination name is required"],
        trim: true
    },
    location: {
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
    },
    description: {
        type: String,
        required: true,
        minLength: [10, "Description must be at least 10 characters long"]
    },
    images: [{
        type: String,  // URLs to images
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Cultural']
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Destination', DestinationSchema);