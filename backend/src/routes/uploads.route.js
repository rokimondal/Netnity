import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUploadSecret, storeTempImage } from '../controllers/uploads.controller.js';

const router = express.Router();

router.use(protectRoute)

router.post('/store-temp-image', storeTempImage)

router.get('/get-upload-secret', getUploadSecret)

export default router;