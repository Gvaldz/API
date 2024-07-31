const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const asistencia = require("../controllers/asistencia.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearAsistencia = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: 'Demasiadas solicitudes para crear asistencia desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterModificarAsistencia = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Demasiadas solicitudes para modificar asistencia desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), limiterCrearAsistencia, asistencia.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), asistencia.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), asistencia.findById);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), limiterModificarAsistencia, asistencia.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), asistencia.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), asistencia.deleteAll)

module.exports = router;
