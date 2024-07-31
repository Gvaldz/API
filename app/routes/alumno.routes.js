const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const alumnos = require("../controllers/alumno.controller.js");
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const limiterCrearAlumno = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3, 
  message: 'Demasiadas solicitudes para crear alumnos desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarAlumno = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, 
  message: 'Demasiadas solicitudes para eliminar alumnos desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), limiterCrearAlumno, alumnos.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), alumnos.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), alumnos.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor', 'alumno']), alumnos.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarAlumno, alumnos.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), alumnos.deleteAll);

module.exports = router;
