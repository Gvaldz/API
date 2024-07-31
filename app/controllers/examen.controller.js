const sql = require("../models/db.js");
const Examen = require("../models/examen.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  const examen = new Examen({
    idalumno: req.body.idalumno,
    nombrealumno: req.body.nombrealumno,
    apellidoalumno: req.body.apellidoalumno,
    nombreprofesor: req.body.nombreprofesor,
    apellidoprofesor: req.body.nombreprofesor,
    nombreexaminador: req.body.nombreexaminador,
    apellidoexaminador: req.body.apellidoexaminador,
    fecha: req.body.fecha,
    grado: req.body.grado,
    calificacion: req.body.calificacion,
    aprobado: req.body.aprobado,
    doyang: req.body.doyang,
    basico_concentracion: req.body.basico_concentracion,
    basico_agilidad: req.body.basico_agilidad,
    basico_coordinacion: req.body.basico_coordinacion,
    basico_fuerza: req.body.basico_fuerza,
    pateo_tecnica: req.body.pateo_tecnica,
    pateo_fuerza: req.body.pateo_fuerza,
    pateo_altura: req.body.pateo_altura,
    pateo_velocidad: req.body.pateo_velocidad,
    forma_concentracion: req.body.forma_concentracion,
    forma_equilibrio: req.body.forma_equilibrio,
    forma_sincronizacion: req.body.forma_sincronizacion,
    forma_fuerza: req.body.forma_fuerza,
    combatelibre_velocidad: req.body.combatelibre_velocidad,
    combatelibre_variedad: req.body.combatelibre_variedad,
    combatelibre_coordinacion: req.body.combatelibre_coordinacion,
    rompimiento_tabla_agilidad: req.body.rompimiento_tabla_agilidad,
    rompimiento_tabla_creatividad: req.body.rompimiento_tabla_creatividad,
    rompimiento_tabla_fuerza: req.body.rompimiento_tabla_fuerza,
    pasoscombate_coordinacion: req.body.pasoscombate_coordinacion,
    pasoscombate_agilidad: req.body.pasoscombate_agilidad,
    pasoscombate_fuerza: req.body.pasoscombate_fuerza,
    defensapersonal_coordinacion: req.body.defensapersonal_coordinacion,
    defensapersonal_agilidad: req.body.defensapersonal_agilidad,
    defensapersonal_fuerza: req.body.defensapersonal_fuerza,
  });

  Examen.create(examen, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Examen."
      });
    } else {
      if (req.body.aprobado) {
        sql.query('CALL actualizarGradoAlumno(?, ?, ?)', [req.body.idalumno, req.body.grado, req.body.aprobado], (err, results) => {
          if (err) {
            res.status(500).send({
              message: err.message || "Ocurrió un error al actualizar el grado del alumno después del examen."
            });
          } else {
            res.send({
              message: "Examen creado y grado del alumno actualizado correctamente.",
              data
            });
          }
        });
      } else {
        res.send(data);
      }
    }
  });
};

exports.findOne = (req, res) => {
  const userId = req.userId; 
  const userRole = req.role;  

  Examen.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró examen con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al obtener examen con id " + req.params.id
        });
      }
    } else {
      if (userRole === 'alumno' && data.idalumno !== userId) {
        res.status(403).send({
          message: "No tienes permiso para ver este examen."
        });
      } else {
        res.send(data);
      }
    }
  });
};

exports.findAll = (req, res) => {
  const userId = req.userId;  
  const userRole = req.role;  

  if (userRole === 'alumno') {
    Examen.findByAlumnoId(userId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener los exámenes del alumno."
        });
      } else {
        res.send(data);
      }
    });
  } else {
    Examen.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Ocurrió un error al obtener los exámenes."
        });
      } else {
        res.send(data);
      }
    });
  }
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  Examen.updateById(
    req.params.id,
    new Examen(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró examen con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al actualizar examen con id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Examen.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró examen con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el examen con id " + req.params.id
        });
      }
    } else res.send({ message: `El examen fue eliminado correctamente!` });
  });
};

exports.deleteAll = (req, res) => {
  Examen.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los exámenes."
      });
    else res.send({ message: `Todos los exámenes fueron eliminados correctamente!` });
  });
};
