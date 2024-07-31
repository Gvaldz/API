const sql = require("./db.js");

const Anuncio = function(anuncio) {
    this.titulo = anuncio.titulo;
    this.descripcion = anuncio.descripcion;
};

Anuncio.create = (newAnuncio, result) => {
    sql.query("INSERT INTO anuncios SET ?", newAnuncio, (err, res) => {
        if (err) {
            console.log("Error al crear anuncio: ", err);
            result(err, null);
            return;
        }

        console.log("Anuncio creado correctamente: ", { id: res.insertId, ...newAnuncio });
        result(null, { id: res.insertId, ...newAnuncio });
    });
};

Anuncio.findById = (id, result) => {
    sql.query("SELECT * FROM anuncios WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al buscar anuncio: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Anuncio encontrado: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Anuncio.findByNombre = (titulo, result) => {
    sql.query("SELECT * FROM anuncios WHERE nombre LIKE ?", [`%${titulo}%`], (err, res) => {
        if (err) {
            console.log("Error al buscar anuncio: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Anuncios encontrados: ", res);
            result(null, res);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Anuncio.findByFecha = (fecha, result) => {
    sql.query("SELECT * FROM anuncios WHERE fecha LIKE ?", [`%${fecha}%`], (err, res) => {
        if (err) {
            console.log("Error al buscar anuncio: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Anuncios encontrados: ", res);
            result(null, res);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

Anuncio.getAll = (titulo, result) => {
    let query = "SELECT * FROM anuncios";

    if (titulo) {
        query += ` WHERE nombre LIKE '%${titulo}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("Error al obtener anuncios: ", err);
            result(null, err);
            return;
        }

        console.log("Lista de anuncios: ", res);
        result(null, res);
    });
};

Anuncio.updateById = (id, anuncio, result) => {
    sql.query(
        "UPDATE anuncios SET titulo = ?, descripcion = ?, fecha = ?  WHERE id = ?",
        [anuncio.titulo, anuncio.descripcion, anuncio.fecha, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar anuncio: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Anuncio actualizado correctamente: ", { id: id, ...anuncio });
            result(null, { id: id, ...anuncio });
        }
    );
};

Anuncio.remove = (id, result) => {
    sql.query("DELETE FROM anuncios WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al eliminar anuncio: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Anuncio eliminado correctamente con id: ", id);
        result(null, res);
    });
};

Anuncio.removeAll = result => {
    sql.query("DELETE FROM anuncios", (err, res) => {
        if (err) {
            console.log("Error al eliminar todos los anuncios: ", err);
            result(null, err);
            return;
        }

        console.log(`Todos los anuncios han sido eliminados. Filas afectadas: ${res.affectedRows}`);
        result(null, res);
    });
};

module.exports = Anuncio;
