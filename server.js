const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const https = require('https');
const fs = require('fs');
require('./app/middleware/cron');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const options = {
  key : fs.readFileSync('/etc/letsencrypt/live/jaguaresconnectapi.integrador.xyz/privkey.pem'),
  cert : fs.readFileSync('/etc/letsencrypt/live/jaguaresconnectapi.integrador.xyz/fullchain.pem')
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

const alumnosRoutes = require('./app/routes/alumno.routes');
const listaAsistenciaRoutes = require('./app/routes/listaasistencia.routes')
const anunciosRoutes = require('./app/routes/anuncio.routes');
const asistenciaRoutes = require('./app/routes/asistencia.routes');
const instructorRoutes = require('./app/routes/instructor.routes');
const examenRoutes = require('./app/routes/examen.routes');
const pagoRoutes = require('./app/routes/pago.routes');
const eventoRoutes = require('./app/routes/evento.routes');
const equipoRoutes = require('./app/routes/equipo.routes');
const pedidoRoutes = require('./app/routes/pedido.routes');
const eventoAsistenciaRoutes = require('./app/routes/eventoasistencia.routes');
const reportesRoutes = require('./app/routes/reporte.routes')
const loginRoutes = require('./app/routes/login.routes');
const eventoImgRoutes = require('./app/routes/eventoimage.routes')
const alumnoImgRoutes = require('./app/routes/alumnoImage.routes')
const equipoImgRoutes = require('./app/routes/equipoimage.routes')

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/listas', listaAsistenciaRoutes)
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/instructores', instructorRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/eventos-asistencias', eventoAsistenciaRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/reportes', reportesRoutes)
app.use('/api/eventos-img', eventoImgRoutes)
app.use('/api/alumnos-img', alumnoImgRoutes)
app.use('/api/equipos-img', equipoImgRoutes)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

