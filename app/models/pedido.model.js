const sql = require("./db.js");

const Pedido = function(pedido) {
    this.alumno_id = pedido.alumno_id;
    this.equipo_id = pedido.equipo_id;
};

Pedido.create = (newPedido, result) => {
    sql.query("INSERT INTO pedidos SET ?", newPedido, (err, res) => {
      if (err) {
        console.log("Error al crear pedido: ", err);
        result(err, null);
        return;
      }
  
      console.log("Pedido creado correctamente: ", { id: res.insertId, ...newPedido });
      result(null, { id: res.insertId, ...newPedido });
    });
};

Pedido.findById = (id, result) => {
    sql.query(
        `SELECT 
            pedidos.fecha_pedido,
            pedidos.id AS pedido_id, 
            alumnos.id AS alumno_id, 
            alumnos.nombre AS nombre_alumno, 
            alumnos.apellido, 
            equipos.nombre AS nombre_equipo, 
            equipos.talla, 
            equipos.color,
            equipos.precio,
            equipo_images.*,
            alumno_images.*
        FROM 
            pedidos
        INNER JOIN 
            alumnos ON alumnos.id = pedidos.alumno_id
        INNER JOIN 
            equipos ON equipos.id = pedidos.equipo_id
		LEFT JOIN
			equipo_images ON equipo_images.equipo_id = equipos.id 
		LEFT JOIN
			alumno_images ON alumno_images.alumno_id = pedidos.alumno_id
        WHERE 
            pedidos.id = ?`, 
        [id], 
        (err, res) => {
            if (err) {
                console.log("Error al buscar pedido: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                result(null, res[0]);
            } else {
                result({ kind: "not_found" }, null);
            }
        }
    );
};

Pedido.getAll = result => {
    sql.query(`SELECT 
            pedidos.fecha_pedido,
            pedidos.id AS pedido_id, 
            alumnos.id AS alumno_id, 
            alumnos.nombre AS nombre_alumno, 
            alumnos.apellido, 
            equipos.nombre AS nombre_equipo, 
            equipos.talla, 
            equipos.color,
            equipos.precio,
            equipo_images.*,
            alumno_images.*
        FROM 
            pedidos
        INNER JOIN 
            alumnos ON alumnos.id = pedidos.alumno_id
        INNER JOIN 
            equipos ON equipos.id = pedidos.equipo_id
		LEFT JOIN
			equipo_images ON equipo_images.equipo_id = equipos.id 
		LEFT JOIN
			alumno_images ON alumno_images.alumno_id = pedidos.alumno_id`, (err, res) => {
        if (err) {
            console.log("Error al obtener pedidos: ", err);
            result(null, err);
            return;
        }

        console.log("Pedidos: ", res);
        result(null, res);
    });
};

Pedido.updateById = (id, pedido, result) => {
    sql.query(
        "UPDATE pedidos SET alumno_id = ?, equipo_id = ? WHERE id = ?",
        [pedido.alumno_id, pedido.equipo_id, id],
        (err, res) => {
            if (err) {
                console.log("Error al actualizar pedido: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Pedido actualizado: ", { id: id, ...pedido });
            result(null, { id: id, ...pedido });
        }
    );
};

Pedido.remove = (id, result) => {
    sql.query("DELETE FROM pedidos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Error al eliminar pedido: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Pedido eliminado con id: ", id);
        result(null, res);
    });
};

Pedido.removeAll = result => {
    sql.query("DELETE FROM pedidos", (err, res) => {
        if (err) {
            console.log("Error al eliminar todos los pedidos: ", err);
            result(null, err);
            return;
        }

        console.log(`Eliminados ${res.affectedRows} pedidos`);
        result(null, res);
    });
};

module.exports = Pedido;
