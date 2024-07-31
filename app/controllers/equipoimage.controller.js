const EquipoImage = require("../models/equipoimage.model.js");

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

    const { equipo_id } = req.body;
    const { filename, path: filePath, mimetype } = req.file;

    const newEquipoImage = new EquipoImage({
        equipo_id: equipo_id,
        image_path: filePath,
        image_mimetype: mimetype,
        filename: filename
    });

    EquipoImage.create(newEquipoImage, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error al crear imagen de equipo: " + err.message
            });
        } else {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
    EquipoImage.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las imágenes de equipos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    EquipoImage.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar la imagen de equipo con id " + req.params.id
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

    const EquipoImage = new EquipoImage({
        equipo_id: req.body.equipo_id,
        image_path: req.body.image_path,
        image_mimetype: req.body.image_mimetype,
        filename: req.body.filename
    });

    EquipoImage.updateById(req.params.id, EquipoImage, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar la imagen de equipo con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    EquipoImage.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de equipo con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar la imagen de equipo con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Imagen de equipo eliminada exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    EquipoImage.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las imágenes de equipos."
            });
        else res.send({ message: `¡Todas las imágenes de equipos fueron eliminadas exitosamente!` });
    });
};
