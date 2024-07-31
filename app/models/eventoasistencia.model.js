const sql = require("./db.js");

const EventoAsistencia = function(eventoAsistencia) {
    this.evento_id = eventoAsistencia.evento_id;
    this.alumno_id = eventoAsistencia.alumno_id;
};

EventoAsistencia.create = (newEventoAsistencia, result) => {
    sql.query("INSERT INTO alumnos_eventos SET ?", newEventoAsistencia, (err, res) => {
        if (err) {
            console.log("Error al crear asistencia a evento: ", err);
            result(err, null);
            return;
        }

        console.log("Asistencia a evento creada: ", { id: res.insertId, ...newEventoAsistencia });
        result(null, { id: res.insertId, ...newEventoAsistencia });
    });
};

EventoAsistencia.getAll = result => {
    sql.query("SELECT * FROM alumnos_eventos", (err, res) => {
        if (err) {
            console.log("Error al recuperar asistencias a eventos: ", err);
            result(err, null);
            return;
        }

        console.log("Asistencias a eventos encontradas: ", res);
        result(null, res);
    });
};

EventoAsistencia.findById = (id, result) => {
    sql.query(`SELECT * FROM alumnos_eventos WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("Error al buscar asistencia a evento: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Asistencia a evento encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

EventoAsistencia.updateById = (id, eventoAsistencia, result) => {
    sql.query(
        "UPDATE alumnos_eventos SET evento_id = ?, alumno_id = ? WHERE id = ?",
        [eventoAsistencia.evento_id, eventoAsistencia.alumno_id, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar asistencia a evento: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Asistencia a evento actualizada: ", { id: id, ...eventoAsistencia });
            result(null, { id: id, ...eventoAsistencia });
        }
    );
};

EventoAsistencia.remove = (id, result) => {
    sql.query("DELETE FROM alumnos_eventos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar asistencia a evento: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Asistencia a evento eliminada con id: ", id);
        result(null, res);
    });
};

EventoAsistencia.removeAll = result => {
    sql.query("DELETE FROM alumnos_eventos", (err, res) => {
        if (err) {
            console.log("Error al eliminar todas las asistencias a eventos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminadas ${res.affectedRows} asistencias a eventos`);
        result(null, res);
    });
};

module.exports = EventoAsistencia;
