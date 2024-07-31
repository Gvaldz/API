const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const anuncios = require("../controllers/anuncio.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearAnuncio = rateLimit({
  windowMs: 20 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para crear anuncios desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarAnuncio = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Demasiadas solicitudes para eliminar anuncio desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", limiterCrearAnuncio, authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), anuncios.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), anuncios.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), anuncios.findOne);
router.put("/:id",authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), anuncios.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarAnuncio, anuncios.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']),anuncios.deleteAll);

module.exports = router;
