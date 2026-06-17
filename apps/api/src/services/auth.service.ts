import { SignJWT, jwtVerify } from 'jose';

const secretStr = process.env['JWT_SECRET'];
const isProd = process.env['NODE_ENV'] === 'production';

if (isProd && (!secretStr || secretStr === 'platform-default-super-secret-key-for-job-application-submission-32-chars')) {
  throw new Error('FATAL: JWT_SECRET environment variable is required and must be secure in production mode!');
}

export const JWT_SECRET = new TextEncoder().encode(
  secretStr || 'platform-default-super-secret-key-for-job-application-submission-32-chars',
);

/**
 * Validates admin credentials against hardcoded values and generates a JWT.
 * Admin credentials: admin / admin123
 *
 * @param username The input username
 * @param password The input password
 * @returns A promise that resolves to a token payload if successful, or null
 */
export async function login(
  username: unknown,
  password: unknown,
): Promise<{ token: string } | null> {
  if (username === 'admin' && password === 'admin123') {
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return { token };
  }
  return null;
}

/**
 * Verifies a JWT signature and returns the decoded payload.
 *
 * @param token The JWT string to verify
 * @returns A promise that resolves to the payload if valid, or null
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
