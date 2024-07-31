const sql = require("./db.js");

const Pago = function(pago) {
  this.concepto = pago.concepto;
  this.cantidad = pago.cantidad;
  this.anticipo = pago.anticipo;
  this.realizado = pago.realizado;
  this.alumno_matricula = pago.alumno_matricula
  this.alumno_nombre = pago.alumno_nombre;
  this.alumno_apellido = pago.alumno_apellido;  
};

Pago.create = (newPago, result) => {
  sql.query("INSERT INTO pagos SET ?", newPago, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created pago: ", { id: res.insertId, ...newPago });
    result(null, { id: res.insertId, ...newPago });
  });
};

Pago.findById = (id, result) => {
  sql.query(`SELECT * FROM pagos WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found pago: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Pago.getAll = (concepto, result) => {
  let query = "SELECT * FROM pagos";

  if (concepto) {
    query += ` WHERE concepto LIKE '%${concepto}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("pagos: ", res);
    result(null, res);
  });
};

Pago.getAllRealizados = result => {
  sql.query("SELECT * FROM pagos WHERE realizado = true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("pagos: ", res);
    result(null, res);
  });
};

Pago.getAllPendientes = result => {
    sql.query("SELECT * FROM pagos WHERE realizado = false", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("pagos: ", res);
      result(null, res);
    });
  };
  

Pago.updateById = (id, pago, result) => {
  sql.query(
    "UPDATE pagos SET concepto = ?, cantidad = ?, anticipo = ?, realizado = ?, alumno_matricula = ?, alumno_nombre = ?, alumno_apellido = ? WHERE id = ?",
    [pago.concepto, pago.cantidad, pago.anticipo, pago.realizado, pago.alumno_matricula, pago.alumno_nombre, pago.alumno_apellido, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated pago: ", { id: id, ...pago });
      result(null, { id: id, ...pago });
    }
  );
};

Pago.remove = (id, result) => {
  sql.query("DELETE FROM pagos WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted pago with id: ", id);
    result(null, res);
  });
};

Pago.removeAll = result => {
  sql.query("DELETE FROM pagos", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} pagos`);
    result(null, res);
  });
};

module.exports = Pago;
