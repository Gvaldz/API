const EquipoPedido = require("../models/equipos_pedido.model.js");

exports.create = async (req, res) => {
  try {
    const newEquipoPedido = {
      id_pedido: req.body.id_pedido,
      id_equipo: req.body.id_equipo,
      color: req.body.color,
      talla: req.body.talla,
    };

    const id = await EquipoPedido.create(newEquipoPedido);
    res.status(201).send({ id });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Ocurrió un error al crear la relación equipo-pedido.",
    });
  }
};

exports.findAll = (req, res) => {
  EquipoPedido.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar las relaciones equipo-pedido.",
      });
    } else res.send(data);
  });
};

exports.findOne = (req, res) => {
  EquipoPedido.findById(req.params.id_pedido, req.params.id_equipo, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la relación equipo-pedido con id_pedido ${req.params.id_pedido} e id_equipo ${req.params.id_equipo}.`,
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar la relación equipo-pedido con id_pedido " + req.params.id_pedido + " e id_equipo " + req.params.id_equipo,
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!",
    });
  }

  EquipoPedido.updateById(req.params.id_pedido, req.params.id_equipo, new EquipoPedido(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la relación equipo-pedido con id_pedido ${req.params.id_pedido} e id_equipo ${req.params.id_equipo}.`,
        });
      } else {
        res.status(500).send({
          message: "Error al actualizar la relación equipo-pedido con id_pedido " + req.params.id_pedido + " e id_equipo " + req.params.id_equipo,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  EquipoPedido.remove(req.params.id_pedido, req.params.id_equipo, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la relación equipo-pedido con id_pedido ${req.params.id_pedido} e id_equipo ${req.params.id_equipo}.`,
        });
      } else {
        res.status(500).send({
          message: "Error al eliminar la relación equipo-pedido con id_pedido " + req.params.id_pedido + " e id_equipo " + req.params.id_equipo,
        });
      }
    } else res.send({ message: `¡Relación equipo-pedido eliminada exitosamente!` });
  });
};

exports.deleteAll = (req, res) => {
  EquipoPedido.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todas las relaciones equipo-pedido.",
      });
    } else res.send({ message: `¡Todas las relaciones equipo-pedido fueron eliminadas exitosamente!` });
  });
};
