const Asistencia = require("../models/asistencia.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
        return;
    }

    const asistencia = new Asistencia({
        lista_id: req.body.lista_id,
        fecha: req.body.fecha,
        alumno_id: req.body.alumno_id,
        asistencia: req.body.asistencia,
        dia: req.body.dia
    });

    Asistencia.create(asistencia, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al crear la Asistencia."
            });
        else res.send(data);
    });
};

exports.findById = (req, res) => {
    Asistencia.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Asistencia con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Ocurrió un error al recuperar la Asistencia con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findAll = (req, res) => {
    Asistencia.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las Asistencias."
            });
        else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
        return;
    }

    Asistencia.updateById(
        req.params.id,
        new Asistencia(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `No se encontró la Asistencia con id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Ocurrió un error al actualizar la Asistencia con id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    Asistencia.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Asistencia con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Ocurrió un error al eliminar la Asistencia con id " + req.params.id
                });
            }
        } else res.send({ message: "¡Asistencia eliminada exitosamente!" });
    });
};

exports.deleteAll = (req, res) => {
    Asistencia.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las Asistencias."
            });
        else res.send({ message: "¡Todas las Asistencias fueron eliminadas exitosamente!" });
    });
};
