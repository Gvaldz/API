const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const pago = require("../controllers/pago.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearPago = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para crear pagos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarPago = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para eliminar pagos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterCrearPago, pago.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), pago.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), pago.findOne);
router.get('/realizados', authMiddleware.verifyRole(['administrador', 'instructor']), pago.findAllRealizados)
router.get('/realizados', authMiddleware.verifyRole(['administrador', 'instructor']), pago.findAllPendientes)
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), pago.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), limiterEliminarPago, pago.delete);

module.exports = router;
