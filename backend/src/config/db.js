import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (uri && uri.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (err) {
        // ignore if environment restricts custom DNS
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
