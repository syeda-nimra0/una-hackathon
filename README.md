# NEXUS LMS — Setup Guide

---

## 1. Install Dependencies

```bash
# In nexus-lms/ root
npm run install:all
```

---

## 2. MongoDB

1. Create free cluster at https://cloud.mongodb.com
2. Create a DB user, allow all IPs (0.0.0.0/0)
3. Copy connection string → add `/nexus_lms` as database name

---

## 3. Cloudinary

1. Sign up free at https://cloudinary.com
2. Note your **Cloud Name**, **API Key**, **API Secret**
3. Settings → Upload → Add two unsigned presets:
   - `nexus_screenshots` — for assignment uploads
   - `nexus_avatars` — for profile pictures

---

## 4. Environment Files

**`server/.env`** (copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/nexus_lms
JWT_SECRET=any_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=nexus_screenshots
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## 5. Run

```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

---

## 6. Logo & Favicon

**Logo** — in `LandingPage.jsx`, `StudentLayout.jsx`, `TeacherLayout.jsx` find:
```jsx
{/* REPLACE: swap this with your actual logo image */}
<div className="logo-mark">N</div>
<span>NEXUS</span>
```
Replace with:
```jsx
<img src="/logo.png" alt="YourBrand" style={{ height: 32 }} />
```
Put your `logo.png` in `client/public/`.

**Favicon** — replace `client/public/favicon.ico` with your own.
Generate one free at https://favicon.io

---

Made with NEXUS LMS.
