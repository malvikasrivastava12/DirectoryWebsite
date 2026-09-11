import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix for Windows DNS SRV lookup issues on mongodb+srv:// URIs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  console.warn('DNS server configuration notice:', e);
}

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.startsWith('mongodb') || uri.includes('<username>')) {
    return null;
  }

  // Reuse existing connected client if available
  if (global._mongoClient) {
    try {
      await global._mongoClient.db('admin').command({ ping: 1 });
      return global._mongoClient;
    } catch {
      global._mongoClient = null;
    }
  }

  // Create new connection if no valid client exists
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    global._mongoClient = client;
    return client;
  } catch (err) {
    console.error('MongoDB connection attempt failed:', err.message || err);
    global._mongoClient = null;
    return null;
  }
}

export default getMongoClient;
