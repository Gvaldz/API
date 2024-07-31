const sql = require("./db.js");

const Equipo = function(equipo) {
    this.nombre = equipo.nombre;
    this.talla = equipo.talla;
    this.precio = equipo.precio;
    this.descripcion = equipo.descripcion;
    this.composicion = equipo.composicion;
    this.color = equipo.color;
};

Equipo.create = (newEquipo, result) => {
    sql.query("INSERT INTO equipos SET ?", newEquipo, (err, res) => {
        if (err) {
            console.log("Error al crear equipo: ", err);
            result(err, null);
            return;
        }

        console.log("Equipo creado: ", { id: res.insertId, ...newEquipo });
        result(null, { id: res.insertId, ...newEquipo });
    });
};

Equipo.findById = (id, result) => {
    sql.query(`
        SELECT 
            equipos.*, equipo_images.image_path, equipo_images.image_mimetype, equipo_images.filename
        FROM 
            equipos
        LEFT JOIN 
            equipo_images ON equipos.id = equipo_images.equipo_id
        WHERE 
            equipos.id = ${id}`, (err, res) => {
        if (err) {
            console.log("Error al buscar equipo: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Equipo encontrado: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Equipo.getAll = (result) => {
    sql.query(`
        SELECT 
            equipos.*, equipo_images.image_path, equipo_images.image_mimetype, equipo_images.filename
        FROM 
            equipos
        LEFT JOIN 
            equipo_images ON equipos.id = equipo_images.equipo_id`, (err, res) => {
        if (err) {
            console.log("Error al obtener equipos: ", err);
            result(null, err);
            return;
        }

        console.log("Equipos: ", res);
        result(null, res);
    });
};

Equipo.updateById = (id, equipo, result) => {
    sql.query(
        "UPDATE equipos SET nombre = ?, talla = ?, precio = ?, descripcion = ?, composicion = ?, color = ? WHERE id = ?",
        [equipo.nombre, equipo.talla, equipo.precio, equipo.descripcion, equipo.composicion, equipo.color, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar equipo: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Equipo actualizado: ", { id: id, ...equipo });
            result(null, { id: id, ...equipo });
        }
    );
};

Equipo.remove = (id, result) => {
    sql.query("DELETE FROM equipos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar equipo: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Equipo eliminado con id: ", id);
        result(null, res);
    });
};

Equipo.removeAll = result => {
    sql.query("DELETE FROM equipos", (err, res) => {
        if (err) {
            console.log("Error al eliminar todos los equipos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminados ${res.affectedRows} equipos`);
        result(null, res);
    });
};

module.exports = Equipo;
