const Equipo = require("../models/equipo.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
    }

    const equipo = new Equipo({
        nombre: req.body.nombre,
        talla: req.body.talla,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        composicion: req.body.composicion,
        color: req.body.color,
    });

    Equipo.create(equipo, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al crear el Equipo."
            });
        else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
    }

    const equipo = new Equipo({
        nombre: req.body.nombre,
        talla: req.body.talla,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        composicion: req.body.composicion,
        color: req.body.color,
        // Eliminado image_id
    });

    Equipo.updateById(req.params.id, equipo, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar el Equipo con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findAll = (req, res) => {
    Equipo.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar los Equipos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Equipo.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar el Equipo con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    Equipo.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar el Equipo con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Equipo eliminado exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    Equipo.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todos los Equipos."
            });
        else res.send({ message: `¡Todos los Equipos fueron eliminados exitosamente!` });
    });
};
