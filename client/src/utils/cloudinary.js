// ── Cloudinary Direct Upload Utility ──────────────────────────
// This uploads directly from browser to Cloudinary (no backend needed)
// Requires: unsigned upload preset in Cloudinary dashboard

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file, folder = 'nexus') {
  if (!CLOUD_NAME || CLOUD_NAME === 'your_cloudinary_cloud_name') {
    throw new Error('CLOUDINARY_SETUP_MISSING')
  }
  if (!UPLOAD_PRESET || UPLOAD_PRESET === 'your_upload_preset') {
    throw new Error('CLOUDINARY_PRESET_MISSING')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Upload failed (${res.status})`)
  }

  return data.secure_url
}

export const isCloudinaryConfigured = () =>
  CLOUD_NAME &&
  CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  UPLOAD_PRESET &&
  UPLOAD_PRESET !== 'your_upload_preset'
