const Evento = require("../models/evento.model.js");
const Alumno = require("../models/alumno.model.js");
const { sendMail } = require("./email.js");

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
    }

    const evento = new Evento({
        fecha: req.body.fecha,
        nombre: req.body.nombre,
        lugar: req.body.lugar,
        hora: req.body.hora,
        categorias: req.body.categorias,
        costo: req.body.costo
    });

    Evento.create(evento, (err, data) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Ocurrió un error al crear el Evento."
            });
        }

        Alumno.getAllEmails((err, alumnos) => {
            if (err) {
                console.log("Error al obtener correos de los alumnos: ", err);
                return res.status(500).send({
                    message: "Ocurrió un error al obtener los correos de los alumnos."
                });
            }

            const emailPromises = alumnos.map(alumno => {
                return sendMail(
                    alumno.correo,
                    `Hay un nuevo evento: ${evento.nombre}`,
                    `¡Ingresa a nuestro sitio para saber los detalles e inscribirte!`
                ).then(() => {
                    console.log(`Correo enviado a ${alumno.correo}`);
                }).catch(err => {
                    console.log(`Error al enviar correo a ${alumno.correo}:`, err);
                });
            });

            Promise.all(emailPromises).then(() => {
                res.send(data);
            }).catch(err => {
                console.log("Error al enviar correos: ", err);
                res.status(500).send({
                    message: "Ocurrió un error al enviar los correos."
                });
            });
        });
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
    }

    const evento = new Evento({
        fecha: req.body.fecha,
        nombre: req.body.nombre,
        lugar: req.body.lugar,
        hora: req.body.hora,
        categorias: req.body.categorias,
        costo: req.body.costo
    });

    Evento.updateById(req.params.id, evento, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar el Evento con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findAll = (req, res) => {
    Evento.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar los Eventos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Evento.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar el Evento con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findByEvento = (req, res) => {
    const eventoId = req.params.eventoId;
    Evento.findByEvento(eventoId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontraron alumnos en el evento con id ${eventoId}.`
          });
        } else {
          res.status(500).send({
            message: "Error al recuperar los alumnos del evento con id " + eventoId
          });
        }
      } else {
        res.send(data);
      }
    });
};

exports.delete = (req, res) => {
    Evento.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar el Evento con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Evento eliminado exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    Evento.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todos los Eventos."
            });
        else res.send({ message: `¡Todos los Eventos fueron eliminados exitosamente!` });
    });
};
