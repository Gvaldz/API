const sql = require("./db.js");

const Instructor = function(instructor) {
  this.nombre = instructor.nombre;
  this.apellido = instructor.apellido;
  this.telefono = instructor.telefono;
  this.correo = instructor.correo;
  this.contraseña = instructor.contraseña; 
};

Instructor.create = (newInstructor, result) => {
  sql.query("INSERT INTO instructores SET ?", newInstructor, (err, res) => {
    if (err) {
      console.log("Error al crear instructor: ", err);
      result(err, null);
      return;
    }

    console.log("Instructor creado correctamente: ", { id: res.insertId, ...newInstructor });
    result(null, { id: res.insertId, ...newInstructor });
  });
};

Instructor.findById = (id, result) => {
  sql.query(`SELECT id, nombre, apellido, telefono, correo FROM instructores WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("Error al buscar instructor: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Instructor encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Instructor.findByNombre = (nombre, result) => {
    sql.query(`SELECT id, nombre, apellido, telefono, correo FROM instructores WHERE nombre = ${nombre}`, (err, res) => {
      if (err) {
        console.log("Error al buscar instructor: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Instructor encontrado: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      result({ kind: "not_found" }, null);
    });
  };
  
Instructor.getAll = (nombre, result) => {
  let query = "SELECT id, nombre, apellido, telefono, correo FROM instructores";

  if (nombre) {
    query += ` WHERE nombre LIKE '%${nombre}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("Error al obtener instructores: ", err);
      result(null, err);
      return;
    }

    console.log("Lista de instructores: ", res);
    result(null, res);
  });
};

Instructor.updateById = (id, instructor, result) => {
  sql.query(
      "UPDATE instructores SET nombre = ?, apellido = ?, telefono = ?, correo = ?, contraseña = ? WHERE id = ?",
      [instructor.nombre, instructor.apellido, instructor.telefono, instructor.correo, instructor.contraseña, id],
      (err, res) => {
          if (err) {
              console.log("Error al actualizar evento: ", err);
              result(null, err);
              return;
          }

          if (res.affectedRows == 0) {
              result({ kind: "not_found" }, null);
              return;
          }
          console.log("Evento actualizado: ", { id: id, ...instructor });
          result(null, { id: id, ...instructor });
      }
  );
};

Instructor.remove = (id, result) => {
  sql.query("DELETE FROM instructores WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("Error al eliminar instructor: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Instructor eliminado correctamente con id: ", id);
    result(null, res);
  });
};

Instructor.removeAll = result => {
  sql.query("DELETE FROM instructores", (err, res) => {
    if (err) {
      console.log("Error al eliminar todos los instructores: ", err);
      result(null, err);
      return;
    }

    console.log(`Todos los instructores han sido eliminados. Filas afectadas: ${res.affectedRows}`);
    result(null, res);
  });
};

module.exports = Instructor;
