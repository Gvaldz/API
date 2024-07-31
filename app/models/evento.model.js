const sql = require("./db.js");

const Evento = function(evento) {
    this.fecha = evento.fecha;
    this.nombre = evento.nombre;
    this.lugar = evento.lugar;
    this.hora = evento.hora;
    this.categorias = evento.categorias;
    this.costo = evento.costo;
};

Evento.create = (newEvento, result) => {
    sql.query("INSERT INTO eventos SET ?", newEvento, (err, res) => {
        if (err) {
            console.log("Error al crear evento: ", err);
            result(err, null);
            return;
        }

        console.log("Evento creado: ", { id: res.insertId, ...newEvento });
        result(null, { id: res.insertId, ...newEvento });
    });
};

Evento.updateById = (id, evento, result) => {
    sql.query(
        "UPDATE eventos SET fecha = ?, nombre = ?, lugar = ?, hora = ?, categorias = ?, costo = ? WHERE id = ?",
        [evento.fecha, evento.nombre, evento.lugar, evento.hora, evento.categorias, evento.costo, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar evento: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Evento actualizado: ", { id: id, ...evento });
            result(null, { id: id, ...evento });
        }
    );
};

Evento.findById = (id, result) => {
    sql.query(`		
        SELECT 
		    eventos.*, event_images.image_path, event_images.image_mimetype, event_images.filename
        FROM 
            eventos
        LEFT JOIN 
            event_images ON eventos.id = event_images.event_id
        WHERE 
            eventos.id = ${id}`, (err, res) => {
        if (err) {
            console.log("Error al buscar evento: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Evento encontrado: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Evento.getAll = (result) => {
    sql.query(`		
        SELECT 
		    eventos.*, event_images.image_path, event_images.image_mimetype, event_images.filename
        FROM 
            eventos
        LEFT JOIN 
            event_images ON eventos.id = event_images.event_id`, (err, res) => {
        if (err) {
            console.log("Error al obtener eventos: ", err);
            result(null, err);
            return;
        }

        console.log("Eventos: ", res);
        result(null, res);
    });
};

Evento.findByEvento = (eventoId, result) => {
    sql.query(`SELECT 
        alumnos.id, 
        alumnos.nombre AS alumno_nombre, 
        alumnos.apellido, 
        eventos.nombre AS evento_nombre
        FROM alumnos 
        INNER JOIN alumnos_eventos 
        ON alumnos.id = alumnos_eventos.alumno_id 
        INNER JOIN eventos 
        ON alumnos_eventos.evento_id = eventos.id 
        WHERE alumnos_eventos.evento_id = ?`, [eventoId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Alumnos en el evento: ", res);
        result(null, res);
      } else {
        result({ kind: "not_found" }, null);
      }
    });
};

Evento.remove = (id, result) => {
    sql.query("DELETE FROM eventos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar evento: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Evento eliminado con id: ", id);
        result(null, res);
    });
};

Evento.removeAll = result => {
    sql.query("DELETE FROM eventos", (err, res) => {
        if (err) {
            console.log("Error al eliminar todos los eventos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminados ${res.affectedRows} eventos`);
        result(null, res);
    });
};

module.exports = Evento;
