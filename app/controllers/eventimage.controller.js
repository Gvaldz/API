const EventImage = require("../models/eventimage.model.js");
const path = require('path');

exports.create = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
  }

  if (!req.file) {
    return res.status(400).send({
      message: "No se ha subido ningún archivo."
    });
  }

  const { event_id } = req.body;
  const { filename, path: filePath, mimetype } = req.file;

  const newEventImage = new EventImage({
    event_id: event_id,
    image_path: filePath,
    image_mimetype: mimetype,
    filename: filename
  });

  EventImage.create(newEventImage, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error al crear imagen de evento: " + err.message
      });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
    EventImage.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las imágenes de eventos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    EventImage.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar la imagen de evento con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
    }

    const eventImage = new EventImage({
        event_id: req.body.event_id,
        image_path: req.body.image_path,
        image_mimetype: req.body.image_mimetype,
        filename: req.body.filename
    });

    EventImage.updateById(req.params.id, eventImage, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar la imagen de evento con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    EventImage.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar la imagen de evento con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Imagen de evento eliminada exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    EventImage.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las imágenes de eventos."
            });
        else res.send({ message: `¡Todas las imágenes de eventos fueron eliminadas exitosamente!` });
    });
};
