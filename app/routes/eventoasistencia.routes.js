const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const eventoasistenciaController = require("../controllers/eventoasistencia.controller");
const authMiddleware = require('../middleware/auth');

const limiterCrearAsistenciaEvento = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  message: 'Demasiadas solicitudes para crear asistencias de evento desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarAsistenciaEvento = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiadas solicitudes para eliminar asistencias de evento desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/",authMiddleware.verifyToken ,authMiddleware.verifyRole(['alumno']), limiterCrearAsistenciaEvento, eventoasistenciaController.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador' ,'alumno']), eventoasistenciaController.findAll);
router.get("/:id",authMiddleware.verifyToken, authMiddleware.verifyRole([ 'administrador' , 'alumno']), eventoasistenciaController.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['alumno']), eventoasistenciaController.update);
router.delete("/:id",authMiddleware.verifyToken, authMiddleware.verifyRole(['alumno']), limiterEliminarAsistenciaEvento, eventoasistenciaController.delete);
router.delete("/",authMiddleware.verifyToken, authMiddleware.verifyRole(['alumno']), eventoasistenciaController.deleteAll);

module.exports = router;
