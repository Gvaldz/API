const sql = require("./db.js");

const Reporte = function(reporte) {
  this.id = reporte.id;
  this.mes = reporte.mes;
  this.año = reporte.año;
  this.totalingresos = reporte.totalingresos;
};

Reporte.create = (newReporte, result) => {
  sql.query("INSERT INTO reportes SET ?", newReporte, (err, res) => {
    if (err) {
      console.log("Error al crear reporte: ", err);
      result(err, null);
      return;
    }

    console.log("Reporte creado correctamente: ", { id: res.insertId, ...newReporte });
    result(null, { id: res.insertId, ...newReporte });
  });
};

Reporte.findOne = (id, result) => {
  sql.query("SELECT * FROM reportes WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("Error al buscar reporte: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Reporte encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Reporte.getAll = result => {
  sql.query("SELECT * FROM reportes", (err, res) => {
    if (err) {
      console.log("Error al obtener reportes: ", err);
      result(null, err);
      return;
    }

    console.log("Lista de reportes: ", res);
    result(null, res);
  });
};

module.exports = Reporte;