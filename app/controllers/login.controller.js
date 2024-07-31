const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

  const generateToken = (userId, role) => {
    const payload = { id: userId, role: role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 });
  };
  
  const getRoleFunctionalities = (role) => {
    const functionalities = {
      administrador: ['crear-examen', 'ver-examenes', 'modificar-examen', 'eliminar-examen'],
      instructor: ['ver-examenes', 'crear-examen', 'buscar-alumnos', 'ver-anuncios'],
      alumno: ['ver-mis-examenes', 'crear-pedido', 'ver-eventos', 'modificar-alumno'],
    };
    return functionalities[role] || [];
  };
  
  exports.login = (req, res) => {
    const { login, contraseña } = req.body;
  
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
  
    let query;
    if (isEmail) {
      query = 'SELECT * FROM administradores WHERE correo = ?';
    } else {
      query = 'SELECT * FROM alumnos WHERE id = ?';
    }
  
    db.query(query, [login], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send({ message: 'User not found' });
  
      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(contraseña, user.contraseña);
      if (!passwordIsValid) return res.status(401).send({ token: null, message: 'Invalid Password' });
  
      const token = generateToken(user.id, user.rol);
      const functionalities = getRoleFunctionalities(user.rol);
  
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173', 'https://jaguaresconnect.integrador.xyz');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'Authorization');
      res.setHeader('Authorization', 'Bearer ' + token);
  
      res.status(200).send({
        id: user.id,
        role: user.rol,
        functionalities: functionalities
      });
    });
  };