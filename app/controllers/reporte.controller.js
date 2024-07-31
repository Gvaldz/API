const Reporte = require("../models/reporte.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  const reporte = new Reporte({
    id: req.body.id,
    mes: req.body.mes,
    año: req.body.año,
    totalingresos: req.body.totalingresos,
  });

  Reporte.create(reporte, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Reporte."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Reporte.findOne(req.params.id, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
              res.status(404).send({
                  message: `No se encontró el reporte con id ${req.params.id}.`
              });
          } else {
              res.status(500).send({
                  message: "Error al recuperar el reporte con id " + req.params.id
              });
          }
      } else {
          res.send(data);
      }
  });
};

exports.getAll = (req, res) => {
  Reporte.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Reportes."
      });
    } else {
      res.send(data);
    }
  });
};
