const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const pedido = require("../controllers/pedido.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearPedido = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
  message: 'Demasiadas solicitudes para crear pedidos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarPedido = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para eliminar pedidos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['alumno']), limiterCrearPedido, pedido.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'alumno']), pedido.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'alumno']), pedido.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['alumno']), pedido.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'alumno']), limiterEliminarPedido, pedido.delete);

module.exports = router;
