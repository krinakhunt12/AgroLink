import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import connectDB from '../config/database.js';

dotenv.config();

/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * Run this script once to set up the admin account.
 * 
 * Usage: node src/scripts/createAdmin.js
 */

const createAdmin = async () => {
    try {
        await connectDB();

        console.log('🔧 Creating admin user...\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ userType: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`📧 Email: ${existingAdmin.email}`);
            console.log(`👤 Name: ${existingAdmin.name}`);
            console.log('\n💡 If you forgot the password, you can use the forgot password feature.');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@agrolink.com',
            password: 'Admin@123',
            userType: 'admin',
            location: 'Ahmedabad',
            isVerified: true,
            phone: '1234567890',
            language: 'en'
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('📝 Admin Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: Admin@123`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🌐 Admin Login URL: http://localhost:5173/admin/login');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
