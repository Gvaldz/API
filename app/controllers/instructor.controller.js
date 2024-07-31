const bcrypt = require('bcryptjs');
const Instructor = require("../models/instructor.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  const hashPasswordAndCreateInstructor = (hashedPassword) => {
    const instructor = new Instructor({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      correo: req.body.correo,
      contraseña: hashedPassword
    });

    Instructor.create(instructor, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al crear el Instructor."
        });
      } else {
        res.send(data);
      }
    });
  };

  bcrypt.hash(req.body.contraseña, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al hashhear la contraseña."
      });
      return;
    }
    hashPasswordAndCreateInstructor(hashedPassword);
  });
};

exports.findAll = (req, res) => {  
  const nombre = req.query.nombre;
  const userId = req.userId;  
  const userRole = req.role;  
  if (userRole === 'instructor') {
    Instructor.findById(userId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener el instructor."
        });
      } else {
        res.send(data);
      }
    });
  }else{
    Instructor.getAll(nombre, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al recuperar los Instructores."
        });
      } else {
        res.send(data);
      }
    });
  }
};

exports.findOne = (req, res) => {
  const userId = req.userId;  
  const userRole = req.role;  
  if (userRole === 'instructor') {
    Instructor.findById(userId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener el instructor."
        });
      } else {
        res.send(data);
      }
    });
  }else{
    Instructor.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró el Instructor con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al recuperar el Instructor con id " + req.params.id
          });
        }
      } else {
        res.send(data);
      }
    });
  }
};

exports.findByNombre = (req, res) => {
  Instructor.findByNombre(req.query.nombre, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Instructores."
      });
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  console.log(req.body);

  const updateInstructor = (hashedPassword) => {
    const instructor = new Instructor({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      correo: req.body.correo,
      contraseña: hashedPassword
    });

    Instructor.updateById(req.params.id, instructor, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró el Instructor con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al actualizar el Instructor con id " + req.params.id
          });
        }
      } else {
        res.send(data);
      }
    });
  };

  if (req.body.contraseña) {
    bcrypt.hash(req.body.contraseña, 10, (err, hashedPassword) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al hashhear la contraseña."
        });
        return;
      }
      updateInstructor(hashedPassword);
    });
  } else {
    updateInstructor(req.body.contraseña);
  }
};

exports.delete = (req, res) => {
  Instructor.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Instructor con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el Instructor con id " + req.params.id
        });
      }
    } else {
      res.send({ message: `¡El Instructor fue eliminado exitosamente!` });
    }
  });
};

exports.deleteAll = (req, res) => {
  Instructor.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los Instructores."
      });
    } else {
      res.send({ message: `¡Todos los Instructores fueron eliminados exitosamente!` });
    }
  });
};
