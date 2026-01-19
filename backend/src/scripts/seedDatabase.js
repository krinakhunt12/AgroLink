import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();

        console.log('🗑️  Cleared existing data');

        // Create sample farmers
        const farmers = await User.create([
            {
                name: 'રામજીભાઈ પટેલ',
                phone: '9876543210',
                password: 'password123',
                userType: 'farmer',
                location: 'તાલાલા, ગીર',
                isVerified: true,
                rating: 4.8
            },
            {
                name: 'કાનજીભાઈ આહિર',
                phone: '9876543211',
                password: 'password123',
                userType: 'farmer',
                location: 'ભાલ પ્રદેશ',
                isVerified: true,
                rating: 4.9
            },
            {
                name: 'સુરેશભાઈ ઠાકોર',
                phone: '9876543212',
                password: 'password123',
                userType: 'farmer',
                location: 'ડીસા',
                isVerified: false,
                rating: 4.5
            }
        ]);

        console.log('✅ Created sample farmers');

        // Create sample buyers
        await User.create([
            {
                name: 'મુકેશભાઈ શાહ',
                phone: '9876543220',
                password: 'password123',
                userType: 'buyer',
                location: 'અમદાવાદ'
            },
            {
                name: 'રાજેશભાઈ પટેલ',
                phone: '9876543221',
                password: 'password123',
                userType: 'buyer',
                location: 'સુરત'
            }
        ]);

        console.log('✅ Created sample buyers');

        // Create sample products
        await Product.create([
            {
                name: 'ગીર કેસર કેરી (Gir Kesar)',
                category: 'ફળ',
                price: 1200,
                unit: '20 કિલો',
                description: 'તાજી અને મીઠી કેસર કેરી, ગીર પ્રદેશમાંથી સીધી',
                farmer: farmers[0]._id,
                farmerName: farmers[0].name,
                location: farmers[0].location,
                image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4f4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                rating: 4.8,
                isNegotiable: true,
                isVerified: true,
                stock: 50,
                status: 'active'
            },
            {
                name: 'દેશી ઘઉં (ટુકડા)',
                category: 'અનાજ',
                price: 600,
                unit: '20 કિલો',
                description: 'શુદ્ધ દેશી ઘઉં, કોઈ રસાયણ વિના ઉગાડેલ',
                farmer: farmers[1]._id,
                farmerName: farmers[1].name,
                location: farmers[1].location,
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                rating: 4.9,
                isNegotiable: false,
                isVerified: true,
                stock: 200,
                status: 'active'
            },
            {
                name: 'તાજા ટામેટા',
                category: 'શાકભાજી',
                price: 400,
                unit: '20 કિલો',
                description: 'તાજા લાલ ટામેટા, આજે જ તોડેલા',
                farmer: farmers[2]._id,
                farmerName: farmers[2].name,
                location: farmers[2].location,
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                rating: 4.5,
                isNegotiable: true,
                isVerified: false,
                stock: 30,
                status: 'active'
            },
            {
                name: 'ઓર્ગેનિક જીરું',
                category: 'મસાલા',
                price: 5500,
                unit: '20 કિલો',
                description: 'શુદ્ધ ઓર્ગેનિક જીરું, પ્રમાણિત',
                farmer: farmers[0]._id,
                farmerName: farmers[0].name,
                location: farmers[0].location,
                image: 'https://images.unsplash.com/photo-1596040033229-a0b3b8b3c5e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                rating: 4.7,
                isNegotiable: true,
                isVerified: true,
                stock: 100,
                status: 'active'
            }
        ]);

        console.log('✅ Created sample products');
        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Sample Login Credentials:');
        console.log('Farmer: 9876543210 / password123');
        console.log('Buyer: 9876543220 / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
