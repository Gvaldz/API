const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const alumnomagesController = require("../controllers/alumnoimage.controller");
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

const limiterCrearImagenalumno = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para crear imágenes de alumnos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarImagenalumno = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Demasiadas solicitudes para eliminar imágenes de alumnos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), limiterCrearImagenalumno, alumnomagesController.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), alumnomagesController.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), alumnomagesController.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), upload.single('image'), alumnomagesController.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarImagenalumno, alumnomagesController.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), alumnomagesController.deleteAll);

module.exports = router;