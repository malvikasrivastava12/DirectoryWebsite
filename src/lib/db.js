import clientPromise from './mongodb';

// Initial Seed Data with 10 diverse, realistic business listings
const INITIAL_LISTINGS = [
  {
    id: "lst-001",
    name: "Apex Tech Solutions",
    category: "Technology",
    location: "San Francisco, CA",
    phone: "+1 (415) 890-1234",
    description: "Enterprise cloud software development, AI integration, and full-stack cybersecurity consulting services.",
    email: "contact@apextech.io",
    website: "https://apextech.io",
    rating: 4.9,
    featured: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "lst-002",
    name: "BioHealth Diagnostics Clinic",
    category: "Healthcare",
    location: "Boston, MA",
    phone: "+1 (617) 555-9876",
    description: "State-of-the-art medical testing lab offering rapid diagnostics, wellness checkups, and preventive health screenings.",
    email: "info@biohealthclinic.com",
    website: "https://biohealthclinic.com",
    rating: 4.8,
    featured: true,
    createdAt: "2026-01-18T10:30:00.000Z",
    updatedAt: "2026-01-18T10:30:00.000Z",
  },
  {
    id: "lst-003",
    name: "Urban Harvest Bistro & Bar",
    category: "Dining & Food",
    location: "Seattle, WA",
    phone: "+1 (206) 444-3210",
    description: "Farm-to-table organic dining with craft cocktails, artisan sourdough pizzas, and locally sourced seasonal menus.",
    email: "reservations@urbanharvestbistro.com",
    website: "https://urbanharvestbistro.com",
    rating: 4.7,
    featured: false,
    createdAt: "2026-01-20T14:15:00.000Z",
    updatedAt: "2026-01-20T14:15:00.000Z",
  },
  {
    id: "lst-004",
    name: "Skyline Realty Group",
    category: "Real Estate",
    location: "New York, NY",
    phone: "+1 (212) 777-6543",
    description: "Luxury residential apartment sales, commercial property leasing, and corporate real estate portfolio management.",
    email: "properties@skylinerealty.com",
    website: "https://skylinerealty.com",
    rating: 4.9,
    featured: true,
    createdAt: "2026-01-22T11:45:00.000Z",
    updatedAt: "2026-01-22T11:45:00.000Z",
  },
  {
    id: "lst-005",
    name: "Vanguard Financial Advisors",
    category: "Finance & Legal",
    location: "Chicago, IL",
    phone: "+1 (312) 888-4321",
    description: "Comprehensive wealth management, tax planning, retirement strategies, and corporate legal advice.",
    email: "advisors@vanguardfa.com",
    website: "https://vanguardfa.com",
    rating: 4.6,
    featured: false,
    createdAt: "2026-01-25T16:00:00.000Z",
    updatedAt: "2026-01-25T16:00:00.000Z",
  },
  {
    id: "lst-006",
    name: "EcoDrive Auto Services",
    category: "Automotive",
    location: "Austin, TX",
    phone: "+1 (512) 333-7890",
    description: "Electric vehicle maintenance, hybrid battery diagnostics, brake service, and eco-friendly auto detailing.",
    email: "service@ecodriveauto.com",
    website: "https://ecodriveauto.com",
    rating: 4.8,
    featured: false,
    createdAt: "2026-02-01T08:20:00.000Z",
    updatedAt: "2026-02-01T08:20:00.000Z",
  },
  {
    id: "lst-007",
    name: "BrightPath Academy",
    category: "Education",
    location: "Denver, CO",
    phone: "+1 (303) 666-1212",
    description: "STEM-focused private tutoring, college entrance exam preparation, and interactive coding bootcamps for teens.",
    email: "admissions@brightpath.edu",
    website: "https://brightpath.edu",
    rating: 4.9,
    featured: true,
    createdAt: "2026-02-05T13:10:00.000Z",
    updatedAt: "2026-02-05T13:10:00.000Z",
  },
  {
    id: "lst-008",
    name: "Lumina Home & Living",
    category: "Retail & Shopping",
    location: "Los Angeles, CA",
    phone: "+1 (310) 999-5544",
    description: "Modern minimalist home furniture, sustainable lighting solutions, and bespoke interior design decor.",
    email: "support@luminahome.com",
    website: "https://luminahome.com",
    rating: 4.5,
    featured: false,
    createdAt: "2026-02-10T15:30:00.000Z",
    updatedAt: "2026-02-10T15:30:00.000Z",
  },
  {
    id: "lst-009",
    name: "ProClean Facilities Management",
    category: "Services",
    location: "Miami, FL",
    phone: "+1 (305) 222-8899",
    description: "Commercial building maintenance, green janitorial services, and HVAC sterilization for corporate offices.",
    email: "hello@procleanfacilities.com",
    website: "https://procleanfacilities.com",
    rating: 4.7,
    featured: false,
    createdAt: "2026-02-14T09:40:00.000Z",
    updatedAt: "2026-02-14T09:40:00.000Z",
  },
  {
    id: "lst-100",
    name: "Nexus Cloud Systems",
    category: "Technology",
    location: "Atlanta, GA",
    phone: "+1 (404) 777-1122",
    description: "Scalable DevOps infrastructure, microservices architecture, and 24/7 managed server operations.",
    email: "contact@nexuscloud.net",
    website: "https://nexuscloud.net",
    rating: 4.8,
    featured: false,
    createdAt: "2026-02-18T11:05:00.000Z",
    updatedAt: "2026-02-18T11:05:00.000Z",
  }
];

// Helper to access MongoDB collection
async function getMongoCollection() {
  if (!clientPromise) {
    throw new Error('MongoDB client is not initialized. Check MONGODB_URI in .env');
  }
  const client = await clientPromise;
  if (!client) {
    throw new Error('Could not connect to MongoDB Atlas database');
  }
  const db = client.db('DirectoryListWebsite');
  const collection = db.collection('DirectoryListWebsite');

  // Auto-seed if collection is empty
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertMany(INITIAL_LISTINGS);
    console.log('MongoDB collection "DirectoryListWebsite" auto-seeded with initial data');
  }

  return collection;
}

export async function getListings(searchQuery, category) {
  const collection = await getMongoCollection();
  const filter = {};

  if (category && category !== 'All') {
    filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
    ];
  }

  const docs = await collection.find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(doc => ({
    id: doc.id || doc._id?.toString(),
    name: doc.name,
    category: doc.category,
    location: doc.location,
    phone: doc.phone,
    description: doc.description,
    email: doc.email,
    website: doc.website,
    rating: doc.rating,
    featured: doc.featured,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

export async function getListingById(id) {
  const collection = await getMongoCollection();
  const doc = await collection.findOne({ id });
  if (!doc) return null;
  return {
    id: doc.id || doc._id?.toString(),
    name: doc.name,
    category: doc.category,
    location: doc.location,
    phone: doc.phone,
    description: doc.description,
    email: doc.email,
    website: doc.website,
    rating: doc.rating,
    featured: doc.featured,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createListing(data) {
  const collection = await getMongoCollection();
  const now = new Date().toISOString();
  const newListing = {
    ...data,
    id: `lst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(newListing);
  return newListing;
}

export async function updateListing(id, data) {
  const collection = await getMongoCollection();
  const updatedAt = new Date().toISOString();

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: { ...data, updatedAt } },
    { returnDocument: 'after' }
  );

  if (!result) return null;

  return {
    id: result.id || result._id?.toString(),
    name: result.name,
    category: result.category,
    location: result.location,
    phone: result.phone,
    description: result.description,
    email: result.email,
    website: result.website,
    rating: result.rating,
    featured: result.featured,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function deleteListing(id) {
  const collection = await getMongoCollection();
  const res = await collection.deleteOne({ id });
  return res.deletedCount > 0;
}
