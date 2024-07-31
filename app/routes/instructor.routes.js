const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const instructor = require("../controllers/instructor.controller.js");
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const limiterCrearInstructor = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2, 
  message: 'Demasiadas solicitudes para crear instructores desde esta IP, por favor intenta de nuevo más tarde.',
});

const limiterEliminarInstructor = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Demasiadas solicitudes para eliminar instructores desde esta IP, por favor intenta de nuevo más tarde.',
});

router.post("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterCrearInstructor, instructor.create);
router.get("/", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), instructor.findAll);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador', 'instructor']), instructor.findOne);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), instructor.update);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.verifyRole(['administrador']), limiterEliminarInstructor, instructor.delete);

module.exports = router;
