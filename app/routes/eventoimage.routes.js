const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const eventImagesController = require("../controllers/eventimage.controller");
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
require('dotenv').config();
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

const limiterCrearImagenEvento = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
  message: 'Demasiadas solicitudes para crear imágenes de eventos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarImagenEvento = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Demasiadas solicitudes para eliminar imágenes de eventos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), limiterCrearImagenEvento, eventImagesController.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), eventImagesController.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), eventImagesController.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), eventImagesController.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarImagenEvento, eventImagesController.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), eventImagesController.deleteAll);

module.exports = router;
