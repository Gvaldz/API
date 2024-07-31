const cron = require('node-cron');
const Alumno = require('../models/alumno.model');
const { sendMail } = require('../controllers/email');
const moment = require('moment');

const DAYS_BEFORE_REMINDER = 5;

const checkAndSendReminders = () => {
  Alumno.getFecha((err, alumnos) => {
    if (err) {
      console.error('Error retrieving students for reminders:', err);
      return;
    }

    const today = moment();

    alumnos.forEach(alumno => {
      const fechainicio = moment(alumno.fechainicio);
      const nextPaymentDate = fechainicio.clone().add(today.diff(fechainicio, 'months') + 1, 'months');
      const reminderDate = nextPaymentDate.clone().subtract(DAYS_BEFORE_REMINDER, 'days');

      if (today.isSame(reminderDate, 'day')) {
        const subject = 'Recordatorio de pago de mensualidad';
        const text = `Hola ${alumno.nombre},\n\nTe recordamos que tu pago de mensualidad está próximo a vencer el ${nextPaymentDate.format('YYYY-MM-DD')}. Por favor, realiza tu pago antes de esta fecha.Gracias.`;
        
        sendMail(alumno.correo, subject, text)
          .then(() => console.log(`Recordatorio enviado a ${alumno.correo}`))
          .catch(err => console.error(`Error enviando correo a ${alumno.correo}:`, err));
      }
    });
  });
};

cron.schedule('0 9 * * *', checkAndSendReminders);
