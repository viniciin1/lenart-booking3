import { Router } from 'express'
import multer from 'multer'
import cloudinary from '../lib/cloudinary.js'
import { requireAuth } from '../lib/auth.js'

const router  = Router()
const storage = multer.memoryStorage()
const upload  = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Apenas imagens são permitidas.'))
  },
})

const FOLDER = 'lenart-gallery'

/**
 * GET /api/gallery
 * Returns all gallery images from Cloudinary.
 */
router.get('/', async (_req, res) => {
  try {
    const result = await cloudinary.search
      .expression(`folder:${FOLDER}`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute()

    const images = result.resources.map(r => ({
      id:        r.public_id,
      url:       r.secure_url,
      thumbnail: cloudinary.url(r.public_id, {
        width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto',
      }),
      createdAt: r.created_at,
    }))

    res.json({ images })
  } catch (err) {
    console.error('[gallery] fetch error:', err.message)
    res.status(500).json({ message: 'Erro ao carregar a galeria.' })
  }
})

/**
 * POST /api/gallery  (admin only)
 * Uploads a new image to Cloudinary.
 */
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada.' })
  }

  try {
    const b64    = req.file.buffer.toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder:        FOLDER,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })

    res.status(201).json({
      id:        result.public_id,
      url:       result.secure_url,
      thumbnail: cloudinary.url(result.public_id, {
        width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto',
      }),
      createdAt: result.created_at,
    })
  } catch (err) {
    console.error('[gallery] upload error:', err.message)
    res.status(500).json({ message: 'Erro ao fazer upload da imagem.' })
  }
})

/**
 * DELETE /api/gallery/:id  (admin only)
 * Deletes an image from Cloudinary.
 */
router.delete('/:id(*)', requireAuth, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error('[gallery] delete error:', err.message)
    res.status(500).json({ message: 'Erro ao apagar a imagem.' })
  }
})

export default router
