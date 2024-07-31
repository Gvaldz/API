const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const equipoController = require("../controllers/equipoimage.controller");
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

const limiterCrearImagenEquipo = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
  message: 'Demasiadas solicitudes para crear imágenes de Equipos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarImagenEquipo = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Demasiadas solicitudes para eliminar imágenes de Equipos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), limiterCrearImagenEquipo, equipoController.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), equipoController.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), equipoController.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), equipoController.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarImagenEquipo, equipoController.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), equipoController.deleteAll);

module.exports = router;