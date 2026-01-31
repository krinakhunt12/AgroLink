import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import mlService from '../services/mlService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer only)
export const createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, deliveryAddress, paymentMethod, notes } = req.body;

        // Get product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Calculate total price
        const totalPrice = product.price * quantity;

        // Create order
        const order = await Order.create({
            product: productId,
            buyer: req.user.id,
            farmer: product.farmer,
            quantity,
            pricePerUnit: product.price,
            totalPrice,
            deliveryAddress,
            paymentMethod,
            notes
        });

        // Update product stock
        product.stock -= quantity;
        if (product.stock === 0) {
            product.status = 'sold';
        }
        await product.save();

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (buyer's orders)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
    try {
        let query = {};

        // If buyer, show their orders
        if (req.user.userType === 'buyer') {
            query.buyer = req.user.id;
        }
        // If farmer, show orders for their products
        else if (req.user.userType === 'farmer') {
            query.farmer = req.user.id;
        }

        const orders = await Order.find(query)
            .populate('product', 'name image category')
            .populate('buyer', 'name phone location')
            .populate('farmer', 'name phone location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product')
            .populate('buyer', 'name phone location')
            .populate('farmer', 'name phone location');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user is order owner or farmer
        if (order.buyer.toString() !== req.user.id && order.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer only)
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Only farmer can update order status
        if (order.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        order.status = status;

        // BLOCKCHAIN INTEGRITY SEAL: If status is delivered, finalize it on the ledger
        if (status === 'delivered') {
            console.log(`[Blockchain-Security] Sealing Integrity for Order: ${order._id}`);
            try {
                // Populate product to get name for the seal
                const product = await Product.findById(order.product);

                const sealResult = await mlService.sealIntegrity({
                    farmer_id: order.farmer.toString(),
                    buyer_id: order.buyer.toString(),
                    crop_type: product?.name || 'Agro Product',
                    quantity: order.quantity,
                    agreed_price: order.totalPrice,
                    order_id: order._id.toString()
                });

                if (sealResult && sealResult.integrity_hash) {
                    order.blockchainHash = sealResult.integrity_hash;
                    order.blockchainVerified = true;
                    console.log(`[Blockchain-Security] Seal Generated: ${order.blockchainHash}`);
                }
            } catch (error) {
                console.error('[Blockchain-Security] Failed to generate integrity seal:', error.message);
                // We don't block the request if blockchain fails, but we should log it
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
