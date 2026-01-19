import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        default: '20 કિલો'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', category: 'text', location: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
