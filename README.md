# Directory Listing Website & Admin Panel

A full-stack **Directory Listing Website** built with **Next.js 14 (App Router)**, **React**, **JavaScript / JSX**, **Tailwind CSS**, **API Routes**, and **JWT Cookie Authentication**.

---

## 🚀 Key Features

### 🌐 Public Directory Listing
- **Business Cards Display**: Shows Name, Category, Location, Phone, Description, Email, Website, and Rating.
- **Real-Time Search**: Search listings dynamically by business name, category, location, or description.
- **Category Filtering**: Instant category pills filter (Technology, Healthcare, Dining & Food, Real Estate, Finance, Auto, etc.).
- **Interactive Listing Details Modal**: Click any card to open a full details popup with one-click phone copy/call and website links.
- **Fully Responsive Design**: Optimized for mobile, tablet, and desktop viewports with a modern visual design system.

### 🔐 Admin Panel & Management
- **Protected Admin Dashboard**: Session verification via HTTP-Only JWT cookies.
- **CRUD Operations**: Admin can **Add**, **Edit**, and **Delete** directory listings with instant updates.
- **Dashboard Analytics**: Shows Total Listings count, Active Categories, and Recent Additions.
- **Form Validation**: Comprehensive client-side & server-side validation for all business fields.
- **Interactive Modals**: Seamless popups for adding, editing, and confirming deletion of listings.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server & Client Components)
- **Language**: JavaScript / JSX
- **Styling**: Tailwind CSS, Custom Utility Tokens
- **Icons & Motion**: Lucide React, Framer Motion
- **Authentication**: `jose` (JWT) with HTTP-Only Cookies & `bcryptjs`
- **Persistent Storage**: Persistent file-backed DB store (`/data/listings.json` with fallback to `/tmp` for Vercel read-only filesystem)
- **Deployment**: Vercel ready out-of-the-box

---

## 🔑 Admin Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `admin123` |

---

## 💻 Local Setup & Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/malvikasrivastava12/DirectoryWebsite.git
cd DirectoryWebsite
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

- **Public Directory**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. Build & Production Preview
```bash
npm run build
npm run start
```

---

## 🌐 Deployment to Vercel

1. Push code to GitHub repository.
2. Connect repository to [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**
4. Deploy! The application uses persistent JSON storage in `/tmp` when deployed on Vercel, ensuring all CRUD operations work flawlessly on Vercel serverless functions without external database setup.

---

## 📝 API Endpoints

- `GET /api/listings` - Retrieve all directory listings (supports `?search=` and `?category=` queries)
- `GET /api/listings/:id` - Retrieve single business listing by ID
- `POST /api/listings` - Create new listing (Admin auth required)
- `PUT /api/listings/:id` - Update existing listing (Admin auth required)
- `DELETE /api/listings/:id` - Delete listing (Admin auth required)
- `POST /api/auth/login` - Admin login endpoint
- `POST /api/auth/logout` - Admin logout endpoint
- `GET /api/auth/me` - Get current admin session status
