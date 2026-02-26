import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (MONGODB_URI.includes('<username>') || process.env.USE_MOCK === 'true') {
        console.warn('⚠️ WORKING IN MOCK MODE: No real database connected.');
        return { isMock: true };
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Connecting to MongoDB...');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected Successfully');
            return mongoose;
        }).catch(err => {
            console.error('MongoDB Connection Error:', err);
            // Fallback to mock if connection fails to keep app running in dev
            console.warn('⚠️ Connection failed. Falling back to MOCK MODE.');
            return { isMock: true };
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        return { isMock: true };
    }

    return cached.conn;
}

export default dbConnect;
