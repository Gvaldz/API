const AlumnoImage = require("../models/alumnoimage.model.js");

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

    const { alumno_id } = req.body;
    const { filename, path: filePath, mimetype } = req.file;

    const newAlumnoImage = new AlumnoImage({
        alumno_id: alumno_id,
        image_path: filePath,
        image_mimetype: mimetype,
        filename: filename
    });

    AlumnoImage.create(newAlumnoImage, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error al crear imagen de alumno: " + err.message
            });
        } else {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
    AlumnoImage.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar las imágenes de alumnos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    AlumnoImage.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de alumno con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar la imagen de alumno con id " + req.params.id
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

    const alumnoImage = new AlumnoImage({
        alumno_id: req.body.alumno_id,
        image_path: req.body.image_path,
        image_mimetype: req.body.image_mimetype,
        filename: req.body.filename
    });

    AlumnoImage.updateById(req.params.id, alumnoImage, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de alumno con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al actualizar la imagen de alumno con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    AlumnoImage.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró la imagen de alumno con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al eliminar la imagen de alumno con id " + req.params.id
                });
            }
        } else res.send({ message: `¡Imagen de alumno eliminada exitosamente!` });
    });
};

exports.deleteAll = (req, res) => {
    AlumnoImage.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todas las imágenes de alumnos."
            });
        else res.send({ message: `¡Todas las imágenes de alumnos fueron eliminadas exitosamente!` });
    });
};
