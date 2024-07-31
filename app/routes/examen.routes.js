const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const examen = require("../controllers/examen.controller");
const authMiddleware = require('../middleware/auth');

const limiterCrearExamen = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: 'Demasiadas solicitudes para crear exámenes desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarExamen = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para eliminar exámenes desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", limiterCrearExamen, authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), examen.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), examen.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), examen.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), examen.update);
router.delete("/:id", limiterEliminarExamen, authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), examen.delete);


module.exports = router;
