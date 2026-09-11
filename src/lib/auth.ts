import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'directory_admin_super_secret_jwt_key_2026'
);

const COOKIE_NAME = 'admin_token';

// Default admin credentials
export const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  // bcrypt hash for 'admin123'
  passwordHash: '$2a$10$7vCgK8Jp5a5v1Q8G8E8a0e8v8G8E8a0e8v8G8E8a0e8v8G8E8a0e',
};

export async function createToken(payload: { email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload ? { email: payload.email as string } : null;
}

export function validateAdminCredentials(email: string, password: string): boolean {
  if (email.toLowerCase().trim() === 'admin@gmail.com' && password === 'admin123') {
    return true;
  }
  return false;
}
