import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import GuideProfile from '../models/GuideProfile.js';
import Destination from '../models/Destination.js';
import GuideRequest from '../models/GuideRequest.js';
import Review from '../models/Review.js';
import { destinationsData, usersData } from './seedData.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Review.deleteMany();
    await GuideRequest.deleteMany();
    await Destination.deleteMany();
    await GuideProfile.deleteMany();
    await User.deleteMany();

    console.log('📍 Inserting Chhattisgarh destinations...');
    const createdDestinations = await Destination.insertMany(destinationsData);
    console.log(`✅ ${createdDestinations.length} destinations seeded.`);

    console.log('👤 Creating users and guide profiles...');
    const userMap = {};
    const guideProfileMap = {};

    for (const userData of usersData) {
      const { guideInfo, ...userInfo } = userData;

      // Create user (triggers password hashing)
      const user = await User.create(userInfo);
      userMap[user.email] = user;

      // If guide, create corresponding GuideProfile
      if (user.role === 'guide' && guideInfo) {
        const profile = await GuideProfile.create({
          user: user._id,
          ...guideInfo,
        });
        guideProfileMap[user.email] = profile;
      }
    }
    console.log(`✅ ${Object.keys(userMap).length} users seeded.`);

    // Create a sample completed booking request & verified review for demonstration
    const rahul = userMap['rahul@example.com'];
    const rameshProfile = guideProfileMap['ramesh.bastar@example.com'];
    const chitrakote = createdDestinations.find((d) => d.slug === 'chitrakote-waterfall');

    if (rahul && rameshProfile && chitrakote) {
      console.log('📝 Creating sample booking request and review...');
      const sampleRequest = await GuideRequest.create({
        tourist: rahul._id,
        guide: rameshProfile._id,
        destination: chitrakote._id,
        date: new Date('2026-08-15'),
        numberOfPeople: 2,
        message: 'Looking for a private tour of Chitrakote waterfall and local Bastar tribal market.',
        status: 'completed',
      });

      await Review.create({
        tourist: rahul._id,
        guide: rameshProfile._id,
        request: sampleRequest._id,
        rating: 5,
        comment: 'Ramesh was fantastic! He showed us secret viewpoint spots at Chitrakote and explained the history of Bastar tribes with immense passion. Highly recommended!',
      });
      console.log('✅ Sample completed request & review created.');
    }

    console.log('\n==================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('🔑 TEST CREDENTIALS:');
    console.log('👉 Admin:   admin@cg.gov.in / adminpassword123');
    console.log('👉 Tourist: rahul@example.com / tourist123');
    console.log('👉 Tourist: priya@example.com / tourist123');
    console.log('👉 Guide:   ramesh.bastar@example.com / guide123 (Bastar Specialist)');
    console.log('👉 Guide:   devendra.heritage@example.com / guide123 (Heritage Specialist)');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Review.deleteMany();
    await GuideRequest.deleteMany();
    await Destination.deleteMany();
    await GuideProfile.deleteMany();
    await User.deleteMany();
    console.log('🗑️ All database data destroyed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
