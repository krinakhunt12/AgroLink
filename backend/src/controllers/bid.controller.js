import Bid from '../models/Bid.model.js';
import Product from '../models/Product.model.js';

// @desc    Create a bid
// @route   POST /api/bids
// @access  Private (Buyer only)
export const createBid = async (req, res, next) => {
    try {
        const { productId, amount, quantity, message } = req.body;

        // Check if product exists and is negotiable
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.isNegotiable) {
            return res.status(400).json({
                success: false,
                message: 'This product is not open for bidding'
            });
        }

        // Create bid
        const bid = await Bid.create({
            product: productId,
            buyer: req.user.id,
            buyerName: req.user.name,
            amount,
            quantity,
            message
        });

        res.status(201).json({
            success: true,
            data: bid
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get bids for a product
// @route   GET /api/bids/product/:productId
// @access  Private (Farmer - own products)
export const getProductBids = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Only product owner can see bids
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these bids'
            });
        }

        const bids = await Bid.find({ product: req.params.productId })
            .populate('buyer', 'name phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update bid status
// @route   PUT /api/bids/:id
// @access  Private (Farmer only)
export const updateBidStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const bid = await Bid.findById(req.params.id).populate('product');

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found'
            });
        }

        // Only product owner can update bid status
        if (bid.product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bid'
            });
        }

        bid.status = status;
        await bid.save();

        res.status(200).json({
            success: true,
            data: bid
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get buyer's bids
// @route   GET /api/bids/my-bids
// @access  Private (Buyer only)
export const getMyBids = async (req, res, next) => {
    try {
        const bids = await Bid.find({ buyer: req.user.id })
            .populate('product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        next(error);
    }
};
