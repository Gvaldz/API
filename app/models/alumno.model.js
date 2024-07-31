const sql = require("./db.js");

const Alumno = function(alumno) {
  this.nombre = alumno.nombre;
  this.apellido = alumno.apellido;
  this.edad = alumno.edad;
  this.cinta = alumno.cinta;
  this.mensualidad = alumno.mensualidad;
  this.tutor_nombre = alumno.tutor_nombre;
  this.tutor_apellido = alumno.tutor_apellido;
  this.activo = alumno.activo;
  this.nacimiento = alumno.nacimiento;
  this.telefono = alumno.telefono;
  this.correo = alumno.correo;
  this.fechainicio = alumno.fechainicio;
  this.contraseña = alumno.contraseña;
  this.curp = alumno.curp;
  this.horario = alumno.horario;
  this.id = alumno.id;
};

Alumno.create = (newAlumno, result) => {
  sql.query("INSERT INTO alumnos SET ?", newAlumno, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Alumno creado: ", { id: res.insertId, ...newAlumno });
    result(null, { id: res.insertId, ...newAlumno });
  });
};

Alumno.getHighestId = (year, result) => {
  sql.query(`SELECT id FROM alumnos WHERE id LIKE '${year}%' ORDER BY id DESC LIMIT 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Highest ID: ", res[0].id);
      result(null, res[0].id);
      return;
    }

    result(null, null);
  });
};

Alumno.findById = (id, result) => {
  sql.query(`
SELECT 
    alumnos.id,
    alumnos.nombre,
    alumnos.apellido,
    alumnos.edad,
    alumnos.cinta,
    alumnos.mensualidad,
    alumnos.tutor_nombre,
    alumnos.tutor_apellido,
    alumnos.activo,
    alumnos.nacimiento,
    alumnos.telefono,
    alumnos.correo,
    alumnos.fechainicio,
    alumnos.curp,
    alumnos.horario,
    alumno_images.image_path,
    alumno_images.image_mimetype,
    alumno_images.filename
FROM 
    alumnos
LEFT JOIN 
    alumno_images ON alumnos.id = alumno_images.alumno_id
WHERE 
    alumnos.id = ?
`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Alumno encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Alumno.getAll = result => {
  sql.query(`
SELECT 
    alumnos.id,
    alumnos.nombre,
    alumnos.apellido,
    alumnos.edad,
    alumnos.cinta,
    alumnos.mensualidad,
    alumnos.tutor_nombre,
    alumnos.tutor_apellido,
    alumnos.activo,
    alumnos.nacimiento,
    alumnos.telefono,
    alumnos.correo,
    alumnos.fechainicio,
    alumnos.curp,
    alumnos.horario,
    alumno_images.image_path,
    alumno_images.image_mimetype,
    alumno_images.filename
FROM 
    alumnos
LEFT JOIN 
    alumno_images ON alumnos.id = alumno_images.alumno_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Alumnos: ", res);
    result(null, res);
  });
};

Alumno.getAllEmails = result => {
  sql.query("SELECT correo FROM alumnos", (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }

      result(null, res);
  });
};

Alumno.getFecha = result => {
  sql.query("SELECT id, nombre, correo, fechainicio FROM alumnos WHERE activo = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Alumno.updateById = (id, alumno, result) => {
  sql.query(
    "UPDATE alumnos SET nombre = ?, apellido = ?, edad = ?, cinta = ?, mensualidad = ?, tutor_nombre = ?, tutor_apellido = ?, activo = ?, nacimiento = ?, telefono = ?, correo = ?, fechainicio = ?, contraseña = ?, curp = ?, horario = ? WHERE id = ?",
    [alumno.nombre, alumno.apellido, alumno.edad, alumno.cinta, alumno.mensualidad, alumno.tutor_nombre, alumno.tutor_apellido, alumno.activo, alumno.nacimiento, alumno.telefono, alumno.correo, alumno.fechainicio, alumno.contraseña, alumno.curp, alumno.horario, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Alumno actualizado: ", { id: id, ...alumno });
      result(null, { id: id, ...alumno });
    }
  );
};

Alumno.remove = (id, result) => {
  sql.query("DELETE FROM alumnos WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Alumno eliminado con id: ", id);
    result(null, res);
  });
};

Alumno.removeAll = result => {
  sql.query("DELETE FROM alumnos", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`Se eliminaron ${res.affectedRows} alumnos.`);
    result(null, res);
  });
};

module.exports = Alumno;
