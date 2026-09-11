import { NextResponse } from 'next/server';
import { getListings, createListing } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const listings = await getListings(query, category);
    return NextResponse.json({ listings, count: listings.length }, { status: 200 });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, location, phone, description, email, website, rating, featured } = body;

    // Validation
    const errors = {};
    if (!name || name.trim().length < 2) errors.name = 'Business name must be at least 2 characters';
    if (!category || category.trim().length === 0) errors.category = 'Category is required';
    if (!location || location.trim().length === 0) errors.location = 'Location is required';
    if (!phone || phone.trim().length < 7 || phone.trim().length > 10) errors.phone = 'Valid phone number (7-10 digits) is required';
    if (!description || description.trim().length < 10) errors.description = 'Description must be at least 10 characters';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const newListing = await createListing({
      name: name.trim(),
      category: category.trim(),
      location: location.trim(),
      phone: phone.trim(),
      description: description.trim(),
      email: email ? email.trim() : undefined,
      website: website ? website.trim() : undefined,
      rating: rating ? Number(rating) : 4.5,
      featured: Boolean(featured),
    });

    return NextResponse.json({ message: 'Listing created successfully', listing: newListing }, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
