const Pedido = require("../models/pedido.model.js");
const Alumno = require("../models/alumno.model.js");
const { sendMail } = require("./email.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
        return;
    }

    const pedido = new Pedido({
        alumno_id: req.body.alumno_id,
        equipo_id: req.body.equipo_id
    });

    Pedido.create(pedido, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Ocurrió un error al crear el Pedido."
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
                    "Pedido realizado",
                    "Has realizado un pedido. Por favor, realiza el pago correspondiente."
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
    Pedido.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al recuperar los Pedidos."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Pedido.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Pedido con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error al recuperar el Pedido con id " + req.params.id
                });
            }
        } else {
            res.send(data);
        }
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "¡El contenido no puede estar vacío!"
        });
        return;
    }

    const pedido = new Pedido({
        alumno_id: req.body.alumno_id,
        equipo_id: req.body.equipo_id
    });

    Pedido.updateById(req.params.id, pedido, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Pedido con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error actualizando el Pedido con id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
    Pedido.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No se encontró el Pedido con id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "No se pudo eliminar el Pedido con id " + req.params.id
                });
            }
        } else res.send({ message: `Pedido eliminado correctamente!` });
    });
};

exports.deleteAll = (req, res) => {
    Pedido.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Ocurrió un error al eliminar todos los Pedidos."
            });
        else res.send({ message: "Todos los Pedidos han sido eliminados correctamente!" });
    });
};
