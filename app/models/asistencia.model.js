const sql = require("./db.js");

const Asistencia = function(asistencia) {
    this.lista_id = asistencia.lista_id;
    this.fecha = asistencia.fecha
    this.alumno_id = asistencia.alumno_id;
    this.asistencia = asistencia.asistencia;
    this.dia = asistencia.dia;
};

Asistencia.create = (newAsistencia, result) => {
    sql.query("INSERT INTO asistencias SET ?", newAsistencia, (err, res) => {
        if (err) {
            console.log("Error al crear asistencia: ", err);
            result(err, null);
            return;
        }

        console.log("Asistencia creada: ", { id: res.insertId, ...newAsistencia });
        result(null, { id: res.insertId, ...newAsistencia });
    });
};

Asistencia.findById = (id, result) => {
    sql.query(`SELECT 
            listas_asistencia.fecha_creacion AS fecha_lunes,            
            listas_asistencia.fecha_miercoles,
            listas_asistencia.fecha_viernes,
            listas_asistencia.id AS lista_id,
            asistencias.alumno_id,
            asistencias.asistencia,
            asistencias.dia,
            asistencias.id
        FROM 
            listas_asistencia
        INNER JOIN 
            asistencias ON listas_asistencia.id = asistencias.lista_id 
        WHERE 
            asistencias.lista_id = ?`, [id], (err, res) => {
        if (err) {
            console.log("Error al buscar lista de asistencia: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Lista de asistencia encontrada: ", res);
            result(null, res);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Asistencia.getAll = result => {
    sql.query(`SELECT 
            listas_asistencia.fecha_creacion AS fecha_lunes,            
            listas_asistencia.fecha_miercoles,
            listas_asistencia.fecha_viernes,
            listas_asistencia.id AS lista_id,
            asistencias.alumno_id,
            asistencias.asistencia,
            asistencias.dia,
            asistencias.id
        FROM 
            listas_asistencia
        INNER JOIN 
            asistencias ON listas_asistencia.id = asistencias.lista_id `, (err, res) => {
        if (err) {
            console.log("Error al obtener listas de asistencia: ", err);
            result(null, err);
            return;
        }

        console.log("Listas de asistencia: ", res);
        result(null, res);
    });
};

Asistencia.updateById = (id, asistencia, result) => {
    sql.query(
        "UPDATE asistencias SET asistencia = ?, fecha = ?, dia = ? WHERE id = ?",
        [asistencia.asistencia, asistencia.fecha, asistencia.dia, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar asistencia: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Lista de asistencia actualizada: ", { id: id, ...asistencia });
            result(null, { id: id, ...asistencia });
        }
    );
};

Asistencia.remove = (id, result) => {
    sql.query("DELETE FROM asistencias WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar lista de asistencia: ", err);
            result(null, err);
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

Asistencia.removeAll = result => {
    sql.query("DELETE FROM asistencias", (err, res) => {
        if (err) {
            console.log("Error al eliminar todas las listas de asistencia: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminadas ${res.affectedRows} listas de asistencia`);
        result(null, res);
    });
};

module.exports = Asistencia;
