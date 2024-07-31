const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const evento = require("../controllers/evento.controller.js");
const authMiddleware = require('../middleware/auth');

const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 15 * 1024 * 1024 } 
});

const limiterCrearEvento = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para crear eventos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarEvento = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para eliminar eventos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), upload.single('image'), limiterCrearEvento, evento.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), evento.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), evento.findOne);
router.get("/alumnos/:eventoId", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), evento.findByEvento);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), upload.single('image'), evento.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarEvento, evento.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarEvento, evento.deleteAll);

module.exports = router;
