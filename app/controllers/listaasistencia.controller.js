const ListaAsistencia = require("../models/listaasistencia.model.js");

exports.findAll = (req, res) => {
    ListaAsistencia.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las Listas de Asistencia."
            });
        else res.send(data);
    });
};

exports.findById = (req, res) => {
    ListaAsistencia.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Lista de Asistencia con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Ocurrió un error al recuperar la Lista de Asistencia con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    ListaAsistencia.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la Lista de Asistencia con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Ocurrió un error al eliminar la Lista de Asistencia con id " + req.params.id
                });
            }
        } else res.send({ message: "¡Lista de Asistencia eliminada exitosamente!" });
    });
};

exports.deleteAll = (req, res) => {
    ListaAsistencia.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las Listas de Asistencia."
            });
        else res.send({ message: "¡Todas las Listas de Asistencia fueron eliminadas exitosamente!" });
    });
};
