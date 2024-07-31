const sql = require("./db.js");

const Examen = function(examen) {
  this.idalumno = examen.idalumno;
  this.nombrealumno = examen.nombrealumno;
  this.apellidoalumno = examen.apellidoalumno;
  this.nombreprofesor = examen.nombreprofesor;
  this.apellidoprofesor = examen.apellidoprofesor;
  this.nombreexaminador = examen.nombreexaminador;
  this.apellidoexaminador = examen.apellidoexaminador;
  this.fecha = examen.fecha;
  this.grado = examen.grado;
  this.calificacion = examen.calificacion;
  this.aprobado = examen.aprobado;
  this.doyang = examen.doyang;
  this.basico_concentracion = examen.basico_concentracion;
  this.basico_agilidad = examen.basico_agilidad;
  this.basico_coordinacion = examen.basico_coordinacion;
  this.basico_fuerza = examen.basico_fuerza;
  this.pateo_tecnica = examen.pateo_tecnica;
  this.pateo_fuerza = examen.pateo_fuerza;
  this.pateo_altura = examen.pateo_altura;
  this.pateo_velocidad = examen.pateo_velocidad;
  this.forma_concentracion = examen.forma_concentracion;
  this.forma_equilibrio = examen.forma_equilibrio;
  this.forma_sincronizacion = examen.forma_sincronizacion;
  this.forma_fuerza = examen.forma_fuerza;
  this.combatelibre_velocidad = examen.combatelibre_velocidad;
  this.combatelibre_variedad = examen.combatelibre_variedad;
  this.combatelibre_coordinacion = examen.combatelibre_coordinacion;
  this.rompimiento_tabla_agilidad = examen.rompimiento_tabla_agilidad;
  this.rompimiento_tabla_creatividad = examen.rompimiento_tabla_creatividad;
  this.rompimiento_tabla_fuerza = examen.rompimiento_tabla_fuerza;
  this.pasoscombate_coordinacion = examen.pasoscombate_coordinacion;
  this.pasoscombate_agilidad = examen.pasoscombate_agilidad;
  this.pasoscombate_fuerza = examen.pasoscombate_fuerza;
  this.defensapersonal_coordinacion = examen.defensapersonal_coordinacion;
  this.defensapersonal_agilidad = examen.defensapersonal_agilidad;
  this.defensapersonal_fuerza = examen.defensapersonal_fuerza;
};

Examen.create = (newExamen, result) => {
  sql.query("INSERT INTO examenes SET ?", newExamen, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Examen creado: ", { id: res.insertId, ...newExamen });
    result(null, { id: res.insertId, ...newExamen });
  });
};

Examen.findById = (id, result) => {
  sql.query(`        
        SELECT 
            examenes.*, alumno_images.image_path, alumno_images.image_mimetype, alumno_images.filename
        FROM 
            examenes
        LEFT JOIN 
            alumno_images ON examenes.idalumno = alumno_images.alumno_id
        WHERE 
            examenes.id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Examen encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Examen.findByAlumnoId = (alumnoId, result) => {
  sql.query(`        
        SELECT 
            examenes.*, alumno_images.image_path, alumno_images.image_mimetype, alumno_images.filename
        FROM 
            examenes
        LEFT JOIN 
            alumno_images ON examenes.idalumno = alumno_images.alumno_id
        WHERE 
            examenes.idalumno = ?`, [alumnoId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Examen.getAll = (result) => {
  sql.query(`        
        SELECT 
            examenes.*, alumno_images.image_path, alumno_images.image_mimetype, alumno_images.filename
        FROM 
            examenes
        LEFT JOIN 
            alumno_images ON examenes.idalumno = alumno_images.alumno_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Examenes: ", res);
    result(null, res);
  });
};

Examen.updateById = (id, examen, result) => {
  sql.query(
    "UPDATE examenes SET ? WHERE id = ?",
    [examen, id],
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

      console.log("Examen actualizado: ", { id: id, ...examen });
      result(null, { id: id, ...examen });
    }
  );
};

Examen.remove = (id, result) => {
  sql.query("DELETE FROM examenes WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Examen eliminado con ID: ", id);
    result(null, res);
  });
};

Examen.removeAll = (result) => {
  sql.query("DELETE FROM examenes", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`Eliminados ${res.affectedRows} examenes`);
    result(null, res);
  });
};

module.exports = Examen;
