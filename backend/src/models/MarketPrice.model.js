import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        index: true
    },
    district: {
        type: String,
        required: true,
        index: true
    },
    market: {
        type: String,
        required: true,
        index: true
    },
    commodity: {
        type: String,
        required: true,
        index: true
    },
    variety: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        default: 'FAQ'
    },
    arrival_date: {
        type: String, // Stored as DD/MM/YYYY to match Gov API
        required: true
    },
    parsed_date: {
        type: Date, // For sorting and historical analysis
        required: true,
        index: true
    },
    min_price: {
        type: Number,
        required: true
    },
    max_price: {
        type: Number,
        required: true
    },
    modal_price: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        enum: ['API', 'EXCEL'],
        default: 'API'
    }
}, {
    timestamps: true
});

// Create a unique index to prevent duplicate records for the same market, commodity, variety, and date
marketPriceSchema.index({ state: 1, district: 1, market: 1, commodity: 1, variety: 1, arrival_date: 1 }, { unique: true });

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice;
