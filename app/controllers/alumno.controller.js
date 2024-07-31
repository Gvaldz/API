const bcrypt = require('bcryptjs');
const Alumno = require("../models/alumno.model.js");

exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
  }

  const year = new Date(req.body.fechainicio).getFullYear().toString().slice(-2);

  const generateId = (year, callback) => {
    Alumno.getHighestId(year, (err, highestId) => {
      if (err) {
        callback(err, null);
        return;
      }

      let sequentialNumber = highestId ? parseInt(highestId.slice(2)) + 1 : 1;
      const formattedSequentialNumber = sequentialNumber.toString().padStart(3, '0');
      const id = `${year}${formattedSequentialNumber}`;
      callback(null, id);
    });
  };

  const hashPasswordAndCreateAlumno = async (id) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);

      const alumno = new Alumno({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
        cinta: req.body.cinta,
        mensualidad: req.body.mensualidad,
        tutor_nombre: req.body.tutor_nombre,
        tutor_apellido: req.body.tutor_apellido,
        activo: req.body.activo,
        nacimiento: req.body.nacimiento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        fechainicio: req.body.fechainicio,
        contraseña: hashedPassword,
        curp: req.body.curp,
        horario: req.body.horario,
        id: id
      });

      Alumno.create(alumno, (err, data) => {
        if (err && err.code === 'ER_DUP_ENTRY') {
          generateId(year, (err, newId) => {
            if (err) {
              res.status(500).send({ message: err.message || "Ocurrió un error al generar la matrícula." });
            } else {
              hashPasswordAndCreateAlumno(newId);
            }
          });
        } else if (err) {
          res.status(500).send({ message: err.message || "Ocurrió un error al crear el Alumno." });
        } else {
          res.send(data);
        }
      });
    } catch (err) {
      res.status(500).send({ message: err.message || "Ocurrió un error al procesar la contraseña." });
    }
  };

  generateId(year, (err, id) => {
    if (err) {
      res.status(500).send({ message: err.message || "Ocurrió un error al generar la matrícula." });
    } else {
      hashPasswordAndCreateAlumno(id);
    }
  });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
  }

  const updateAlumno = async (hashedPassword) => {
    try {
      const alumno = new Alumno({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad,
        cinta: req.body.cinta,
        mensualidad: req.body.mensualidad,
        tutor_nombre: req.body.tutor_nombre,
        tutor_apellido: req.body.tutor_apellido,
        activo: req.body.activo,
        nacimiento: req.body.nacimiento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        fechainicio: req.body.fechainicio,
        contraseña: hashedPassword,
        curp: req.body.curp,
        horario: req.body.horario
      });

      Alumno.updateById(req.params.id, alumno, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({ message: `No se encontró el alumno con id ${req.params.id}.` });
          } else {
            res.status(500).send({ message: "Error al actualizar el alumno con id " + req.params.id });
          }
        } else {
          res.send(data);
        }
      });
    } catch (err) {
      res.status(500).send({ message: err.message || "Ocurrió un error al procesar la contraseña." });
    }
  };

  if (req.body.contraseña) {
    bcrypt.hash(req.body.contraseña, 10, (err, hashedPassword) => {
      if (err) {
        res.status(500).send({ message: err.message || "Ocurrió un error al hashhear la contraseña." });
      } else {
        updateAlumno(hashedPassword);
      }
    });
  } else {
    updateAlumno(req.body.contraseña);
  }
};

exports.findAll = (req, res) => {
  const userId = req.userId;  
  const userRole = req.role;  
  if (userRole === 'alumno') {
    Alumno.findById(userId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener los exámenes del alumno."
        });
      } else {
        res.send(data);
      }
    });
  } else {
    Alumno.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al recuperar los alumnos."
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
  if (userRole === 'alumno') {
    Alumno.findById(userId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener los exámenes del alumno."
        });
      } else {
        res.send(data);
      }
    });
  } else {
    Alumno.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró el Alumno con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al recuperar el Alumno con id " + req.params.id
          });
        }
      } else {
        res.send(data);
      }
    });
  }
};

exports.delete = (req, res) => {
  Alumno.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Alumno con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el Alumno con id " + req.params.id
        });
      }
    } else {
      res.send({ message: "¡El Alumno fue eliminado exitosamente!" });
    }
  });
};

exports.deleteAll = (req, res) => {
  Alumno.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los alumnos."
      });
    } else {
      res.send({ message: "¡Todos los Alumnos fueron eliminados exitosamente!" });
    }
  });
};
