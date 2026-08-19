import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET  = process.env.JWT_SECRET ?? 'dev_secret_change_in_production'
const JWT_EXPIRES = '8h'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET) // throws on invalid/expired
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12)
}

export async function checkPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

/**
 * Express middleware – requires a valid Bearer token in Authorization header.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token      = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  try {
    req.admin = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired.' })
  }
}
