const sql = require("./db.js");

const EquipoImage = function(image) {
    this.equipo_id = image.equipo_id;
    this.image_path = image.image_path; 
    this.image_mimetype = image.image_mimetype;
    this.filename = image.filename;  
};

EquipoImage.create = (newImage, result) => {
    sql.query("INSERT INTO equipo_images SET ?", newImage, (err, res) => {
        if (err) {
            console.log("Error al crear imagen de equipoo: ", err);
            result(err, null);
            return;
        }

        console.log("Imagen de equipoo creada: ", { id: res.insertId, ...newImage });
        result(null, { id: res.insertId, ...newImage });
    });
};

EquipoImage.findById = (id, result) => {
    sql.query("SELECT * FROM equipo_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al buscar imagen de equipoo: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Imagen de equipoo encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

EquipoImage.getAll = result => {
    sql.query("SELECT * FROM equipo_images", (err, res) => {
        if (err) {
            console.log("Error al obtener imágenes de equipoos: ", err);
            result(null, err);
            return;
        }

        console.log("Imágenes de equipoos: ", res);
        result(null, res);
    });
};

EquipoImage.updateById = (id, image, result) => {
    const { equipo_id, image_path, image_mimetype, filename } = image;
    sql.query(
        "UPDATE equipo_images SET equipo_id = ?, image_path = ?, image_mimetype = ?, filename = ? WHERE id = ?",
        [equipo_id, image_path, image_mimetype, filename, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar imagen de equipoo: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Imagen de equipoo actualizada: ", { id: id, ...image });
            result(null, { id: id, ...image });
        }
    );
};

EquipoImage.remove = (id, result) => {
    sql.query("DELETE FROM equipo_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al eliminar imagen de equipoo: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Imagen de equipoo eliminada con id: ", id);
        result(null, res);
    });
};

EquipoImage.removeAll = result => {
    sql.query("DELETE FROM equipo_images", (err, res) => {
        if (err) {
            console.log("Error al eliminar todas las imágenes de equipoos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminadas ${res.affectedRows} imágenes de equipoos`);
        result(null, res);
    });
};

module.exports = EquipoImage;
