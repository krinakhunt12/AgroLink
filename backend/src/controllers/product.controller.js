import Product from '../models/Product.model.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const { category, search, minPrice, maxPrice, isNegotiable, status } = req.query;

        // Build query
        let query = {};

        if (category && category !== 'તમામ') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { farmerName: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (isNegotiable !== undefined) {
            query.isNegotiable = isNegotiable === 'true';
        }

        if (status) {
            query.status = status;
        } else {
            query.status = 'active'; // Default to active products
        }

        const products = await Product.find(query)
            .populate('farmer', 'name phone location rating')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name phone location rating isVerified');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmer only)
export const createProduct = async (req, res, next) => {
    try {
        // Add farmer info to request body
        req.body.farmer = req.user.id;
        req.body.farmerName = req.user.name;
        req.body.location = req.user.location;

        // Handle image upload - convert to base64
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            req.body.image = `data:${mimeType};base64,${base64Image}`;
        }

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer - own products only)
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Make sure user is product owner
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        // Handle image upload - convert to base64
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            req.body.image = `data:${mimeType};base64,${base64Image}`;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer - own products only)
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Make sure user is product owner
        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get farmer's products
// @route   GET /api/products/farmer/:farmerId
// @access  Public
export const getFarmerProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            farmer: req.params.farmerId,
            status: 'active'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};
