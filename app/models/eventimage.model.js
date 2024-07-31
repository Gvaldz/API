const sql = require("./db.js");

const EventImage = function(image) {
    this.event_id = image.event_id;
    this.image_path = image.image_path; 
    this.image_mimetype = image.image_mimetype;
    this.filename = image.filename;  
};

EventImage.create = (newImage, result) => {
    sql.query("INSERT INTO event_images SET ?", newImage, (err, res) => {
        if (err) {
            console.log("Error al crear imagen de evento: ", err);
            result(err, null);
            return;
        }

        console.log("Imagen de evento creada: ", { id: res.insertId, ...newImage });
        result(null, { id: res.insertId, ...newImage });
    });
};

EventImage.findById = (id, result) => {
    sql.query("SELECT * FROM event_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al buscar imagen de evento: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Imagen de evento encontrada: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

EventImage.getAll = result => {
    sql.query("SELECT * FROM event_images", (err, res) => {
        if (err) {
            console.log("Error al obtener imágenes de eventos: ", err);
            result(null, err);
            return;
        }

        console.log("Imágenes de eventos: ", res);
        result(null, res);
    });
};

EventImage.updateById = (id, image, result) => {
    const { event_id, image_path, image_mimetype, filename } = image;
    sql.query(
        "UPDATE event_images SET event_id = ?, image_path = ?, image_mimetype = ?, filename = ? WHERE id = ?",
        [event_id, image_path, image_mimetype, filename, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar imagen de evento: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Imagen de evento actualizada: ", { id: id, ...image });
            result(null, { id: id, ...image });
        }
    );
};

EventImage.remove = (id, result) => {
    sql.query("DELETE FROM event_images WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error al eliminar imagen de evento: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Imagen de evento eliminada con id: ", id);
        result(null, res);
    });
};

EventImage.removeAll = result => {
    sql.query("DELETE FROM event_images", (err, res) => {
        if (err) {
            console.log("Error al eliminar todas las imágenes de eventos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminadas ${res.affectedRows} imágenes de eventos`);
        result(null, res);
    });
};

module.exports = EventImage;
