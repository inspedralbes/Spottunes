import cron from "node-cron";
import server from "./server.js";

// Eliminar al subir a producción
// server.storeEvents();

// Ejecuta el método storeEvents() a las 00:00 y 12:00 todos los días
cron.schedule(
  "0 0 0,12 * * *",
  () => {
    server.storeEvents();
  },
  {
    scheduled: true,
    timezone: "Europe/Madrid",
  }
);

// Ejecuta el método moveEvents() cada hora
cron.schedule(
  "0 * * * *",
  () => {
    server.movePastEventsToHistory();
  },
  {
    scheduled: true,
    timezone: "Europe/Madrid",
  }
);
