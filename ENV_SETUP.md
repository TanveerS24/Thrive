# Environment Variables Setup

## Summary
All sensitive information has been successfully moved to `.env` files for both client and server.

## Server (.env)
Located at: `server/.env`

**Sensitive Variables Configured:**
- ✅ `MONGO_URL` - MongoDB Atlas connection string
- ✅ `ENCRYPTION_SECRET` - AES-256 encryption key for data encryption (base64)
- ✅ `SESSION_SECRET` - Express session signing secret
- ✅ `CORS_ORIGIN` - Frontend origin for CORS policy
- ✅ `PORT` - Server port configuration
- ✅ `NODE_ENV` - Environment mode (development/production)

**Files Using Server Secrets:**
- `src/app.js` - Uses `SESSION_SECRET` and `CORS_ORIGIN`
- `src/config/db.js` - Uses `MONGO_URL`
- `src/utils/encryption.util.js` - Uses `ENCRYPTION_SECRET`

## Client (.env)
Located at: `client/.env`

**Variables Configured:**
- ✅ `VITE_API_BASE_URL` - Backend API endpoint (http://localhost:3000/api)
- ✅ `VITE_ENV` - Environment mode (development/production)

**Files Using Client Variables:**
- `src/services/api.ts` - Uses `VITE_API_BASE_URL`

## Example Files
Both `.env.example` files have been created to document:
- Required environment variables
- How to generate secrets
- Different values for development vs production

## Security Notes
1. ⚠️ **Never commit `.env` files** to version control
2. ✅ `.env.example` files are safe to commit and show the structure
3. **Production Checklist:**
   - Generate new `SESSION_SECRET` and `ENCRYPTION_SECRET` for production
   - Set `NODE_ENV=production`
   - Set `secure: true` in cookies for HTTPS
   - Use production MongoDB Atlas credentials
   - Update `CORS_ORIGIN` to your production domain

## Next Steps
1. Add `.env` to `.gitignore` if not already present
2. Replace placeholder secrets with production values when deploying
3. Document secret generation process for your team
