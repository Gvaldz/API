const Anuncio = require("../models/anuncio.model.js");
const Alumno = require("../models/alumno.model.js");
const { sendMail } = require("./email.js");

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
  }

  const anuncio = new Anuncio({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
  });

  Anuncio.create(anuncio, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el anuncio."
      });
      return;
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
          `Nuevo Anuncio: ${anuncio.titulo}`,
          `Se ha creado un nuevo anuncio: ${anuncio.descripcion}`
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

exports.findAll = (req, res) => {
  const titulo = req.query.titulo;
  Anuncio.getAll(titulo, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los anuncios."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Anuncio.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el anuncio con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar el anuncios con id " + req.params.id
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

  Anuncio.updateById(
    req.params.id,
    new Anuncio(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró el anuncio con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error al actualizar el anuncio con id " + req.params.id
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

exports.delete = (req, res) => {
  Anuncio.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el anuncio con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el anuncio con id " + req.params.id
        });
      }
    } else {
      res.send({ message: `¡El anuncio fue eliminado exitosamente!` });
    }
  });
};

exports.deleteAll = (req, res) => {
  Anuncio.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los anuncios."
      });
    else res.send({ message: `¡Todos los anuncios fueron eliminados exitosamente!` });
  });
};
