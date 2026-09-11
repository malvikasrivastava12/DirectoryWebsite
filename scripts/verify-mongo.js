import { MongoClient } from 'mongodb';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const uri = process.env.MONGODB_URI || "mongodb+srv://malvikasrivastava29_db_user:AOPLJs2j4cc3QyBJ@cluster0.xiyjat9.mongodb.net/DirectoryListWebsite?retryWrites=true&w=majority";

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

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db('DirectoryListWebsite');
    const col = db.collection('DirectoryListWebsite');

    let count = await col.countDocuments();
    console.log(`Initial document count in DirectoryListWebsite: ${count}`);

    if (count === 0) {
      console.log("Collection is empty. Inserting initial listings...");
      const res = await col.insertMany(INITIAL_LISTINGS);
      console.log(`Inserted ${res.insertedCount} documents into MongoDB!`);
    } else {
      console.log("Collection already contains data.");
    }

    const docs = await col.find({}).toArray();
    console.log(`Total documents in collection: ${docs.length}`);
    console.log("Sample Document:", docs[0]?.name);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
