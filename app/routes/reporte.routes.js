const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const reporte = require("../controllers/reporte.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearReporte = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Demasiadas solicitudes para crear pedidos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarReporte = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para eliminar pedidos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterCrearReporte, reporte.create);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), reporte.findOne);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), reporte.getAll);

module.exports = router;
