const sql = require("./db.js");

const ListaAsistencia = function(listaAsistencia) {
    this.id = listaAsistencia.id;
    this.fecha_creacion = listaAsistencia.fecha_creacion;
    this.fecha_miercoles = listaAsistencia.fecha_miercoles;
    this.fecha_viernes = listaAsistencia.fecha_viernes;
};

ListaAsistencia.findById = (id, result) => {
    sql.query(`SELECT * FROM listas_asistencia WHERE id = ?`, id, (err, res) => {
        if (err) {
            console.log("Error al buscar lista de asistencia por id: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Lista de asistencia encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

ListaAsistencia.getAll = result => {
    sql.query(`SELECT * FROM listas_asistencia`, (err, res) => {
        if (err) {
            console.log("Error al obtener listas de asistencia: ", err);
            result(err, null);
            return;
        }

        console.log("Listas de asistencia: ", res);
        result(null, res);
    });
};

ListaAsistencia.remove = (id, result) => {
    sql.query("DELETE FROM listas_asistencia WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar lista de asistencia: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Lista de asistencia eliminada con id: ", id);
        result(null, res);
    });
};

module.exports = ListaAsistencia;
