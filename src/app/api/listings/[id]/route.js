import { NextResponse } from 'next/server';
import { getListingById, updateListing, deleteListing } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const listing = await getListingById(params.id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ listing }, { status: 200 });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, location, phone, description, email, website, rating, featured } = body;

    // Validation
    const errors = {};
    if (name !== undefined && name.trim().length < 2) errors.name = 'Business name must be at least 2 characters';
    if (category !== undefined && category.trim().length === 0) errors.category = 'Category is required';
    if (location !== undefined && location.trim().length === 0) errors.location = 'Location is required';
    if (phone !== undefined && (phone.trim().length < 7 || phone.trim().length > 10)) errors.phone = 'Valid phone number (7-10 digits) is required';
    if (description !== undefined && description.trim().length < 10) errors.description = 'Description must be at least 10 characters';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const updated = await updateListing(params.id, {
      ...(name && { name: name.trim() }),
      ...(category && { category: category.trim() }),
      ...(location && { location: location.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(description && { description: description.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(website !== undefined && { website: website.trim() }),
      ...(rating !== undefined && { rating: Number(rating) }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing updated successfully', listing: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const success = await deleteListing(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
