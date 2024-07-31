const express = require('express');
const router = express.Router();
const listasAsistencia = require("../controllers/listaasistencia.controller");
const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), listasAsistencia.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), listasAsistencia.findById);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), listasAsistencia.delete);
router.delete("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), listasAsistencia.deleteAll);

module.exports = router;
