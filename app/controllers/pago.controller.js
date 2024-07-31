const Pago = require("../models/pago.model.js");
const { sendMail } = require('./email.js');
const sql = require("../models/db.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  const pago = new Pago({
    concepto: req.body.concepto,
    cantidad: req.body.cantidad,
    anticipo: req.body.anticipo,
    realizado: req.body.realizado,
    alumno_matricula: req.body.alumno_matricula,
    alumno_nombre: req.body.alumno_nombre,
    alumno_apellido: req.body.alumno_apellido
  });

  Pago.create(pago, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Pago."
      });
    else {
      sql.query("SELECT correo FROM alumnos WHERE id = ?", [pago.alumno_matricula], (err, result) => {
        if (err) {
          console.error("Error al obtener el correo del alumno:", err);
        } else {
          if (result.length) {
            const alumnoCorreo = result[0].correo;
            const mailSubject = `Pago pendiente ${pago.concepto}`;
            const mailText = `Hola ${pago.alumno_nombre},\n\nTienes un pago pendiente de  $${pago.cantidad} por concepto de ${pago.concepto}.`;

            sendMail(alumnoCorreo, mailSubject, mailText)
              .then(info => {
                console.log('Correo enviado: ' + info.response);
              })
              .catch(error => {
                console.log('Error enviando correo: ' + error);
              });
          } else {
            console.log("No se encontró el correo del alumno con matrícula:", pago.alumno_matricula);
          }
        }
      });

      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  const concepto = req.query.concepto;

  Pago.getAll(concepto, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Pagos."
      });
    else res.send(data);
  });
};

exports.findAllRealizados = (req, res) => {
  Pago.getAllRealizados((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Pagos realizados."
      });
    else res.send(data);
  });
};

exports.findAllPendientes = (req, res) => {
  Pago.getAllPendientes((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Pagos pendientes."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Pago.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Pago con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar el Pago con id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  Pago.updateById(
    req.params.id,
    new Pago(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró el Pago con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al actualizar el Pago con id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Pago.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Pago con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el Pago con id " + req.params.id
        });
      }
    } else res.send({ message: `¡El Pago fue eliminado exitosamente!` });
  });
};

exports.deleteAll = (req, res) => {
  Pago.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los Pagos."
      });
    else res.send({ message: `¡Todos los Pagos fueron eliminados exitosamente!` });
  });
};
