const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const equipo = require("../controllers/equipo.controller.js");
const authMiddleware = require('../middleware/auth');

const limiterCrearEquipo = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 6, 
  message: 'Demasiadas solicitudes para crear equipos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarEquipo = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para eliminar equipos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterCrearEquipo, equipo.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), equipo.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), equipo.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), equipo.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarEquipo, equipo.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), equipo.deleteAll);

module.exports = router;
