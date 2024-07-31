const EventoAsistencia = require("../models/eventoasistencia.model");
const Alumno = require("../models/alumno.model.js");
const { sendMail } = require("./email.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
        return;
    }

    const eventoAsistencia = new EventoAsistencia({
        evento_id: req.body.evento_id,
        alumno_id: req.body.alumno_id,
    });

    EventoAsistencia.create(eventoAsistencia, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Ocurrió un error al crear la Asistencia a Evento."
            });
            return;
        }

        Alumno.findById(req.body.alumno_id, (err, alumno) => {
            if (err) {
                console.log("Error al obtener el alumno: ", err);
                return;
            }

            if (alumno) {
                sendMail(
                    alumno.correo,
                    "Inscripción a evento",
                    "Te has inscrito a un evento. Por favor, recuerda realizar el pago correspondiente."
                ).then(() => {
                    console.log(`Correo enviado a ${alumno.correo}`);
                }).catch(err => {
                    console.log(`Error al enviar correo a ${alumno.correo}:`, err);
                });
            }
        });

        res.send(data);
    });
};

exports.findAll = (req, res) => {
    EventoAsistencia.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las asistencias a eventos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    EventoAsistencia.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Asistencia a Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar la Asistencia a Evento con id " + req.params.id
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

    EventoAsistencia.updateById(req.params.id, new EventoAsistencia(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Asistencia a Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar la Asistencia a Evento con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    EventoAsistencia.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Asistencia a Evento con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar la Asistencia a Evento con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Asistencia a Evento eliminada exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    EventoAsistencia.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las Asistencias a Eventos."
            });
        else res.send({ message: `¡Todas las Asistencias a Eventos fueron eliminadas exitosamente!` });
    });
};
