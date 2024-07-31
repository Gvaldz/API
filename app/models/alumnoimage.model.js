const sql = require("./db.js");

const AlumnoImage = function(image) {
    this.alumno_id = image.alumno_id;
    this.image_path = image.image_path; 
    this.image_mimetype = image.image_mimetype;
    this.filename = image.filename;  
};

AlumnoImage.create = (newImage, result) => {
    sql.query("INSERT INTO alumno_images SET ?", newImage, (err, res) => {
        if (err) {
            console.log("Error al crear imagen de alumno: ", err);
            result(err, null);
            return;
        }

        console.log("Imagen de  creada: ", { id: res.insertId, ...newImage });
        result(null, { id: res.insertId, ...newImage });
    });
};

AlumnoImage.findById = (id, result) => {
    sql.query("SELECT * FROM alumno_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al buscar imagen de alumno: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Imagen de alumno encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

AlumnoImage.getAll = result => {
    sql.query("SELECT * FROM alumno_images", (err, res) => {
        if (err) {
            console.log("Error al obtener imágenes de alumnos: ", err);
            result(null, err);
            return;
        }

        console.log("Imágenes de alumnos: ", res);
        result(null, res);
    });
};

AlumnoImage.updateById = (id, image, result) => {
    const { alumno_id, image_path, image_mimetype, filename } = image;
    sql.query(
        "UPDATE alumno_images SET alumno_id = ?, image_path = ?, image_mimetype = ?, filename = ? WHERE id = ?",
        [alumno_id, image_path, image_mimetype, filename, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar imagen de alumno: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Imagen de alumno actualizada: ", { id: id, ...image });
            result(null, { id: id, ...image });
        }
    );
};

AlumnoImage.remove = (id, result) => {
    sql.query("DELETE FROM alumno_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al eliminar imagen de alumno: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Imagen de alumno eliminada con id: ", id);
        result(null, res);
    });
};

AlumnoImage.removeAll = result => {
    sql.query("DELETE FROM alumno_images", (err, res) => {
        if (err) {
            console.log("Error al eliminar todas las imágenes de alumnos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminadas ${res.affectedRows} imágenes de alumnos`);
        result(null, res);
    });
};

module.exports = AlumnoImage;
