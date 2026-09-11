import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix for Windows DNS SRV lookup issues on mongodb+srv:// URIs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  console.warn('DNS server configuration notice:', e);
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

let clientPromise = null;

if (uri && uri.startsWith('mongodb') && !uri.includes('<username>')) {
  const connectWithCatch = () => {
    const client = new MongoClient(uri, options);
    return client.connect().catch((err) => {
      console.warn('MongoDB connection notice:', err.message || err);
      return null;
    });
  };

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectWithCatch();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = connectWithCatch();
  }
}

export default clientPromise;
