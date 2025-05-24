const cron = require("cron");
const mysql = require('mysql2/promise'); // Usamos mysql2/promise para async/await
const { sendMessage } = require("./whatsappService"); // Asegúrate de que la ruta sea correcta

const phoneNumberAlerta = "50497960605"; // Número de teléfono para la alerta

// Configuración de la conexión a la base de datos (CREDENCIALES HARCODEADAS DIRECTAMENTE)
const dbConfig = {
  host: '192.168.2.8',      // Reemplaza con la IP o hostname de tu servidor MySQL
  user: 'root',           // Reemplaza con tu usuario de MySQL
  password: 'SecurityCISA_DB.8',  // Reemplaza con tu contraseña de MySQL
  database: 'vacaciones_programa', // Reemplaza con el nombre de tu base de datos
  port: 3306,             // Reemplaza si tu MySQL usa un puerto diferente al 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const checkEmbalseNivel = async () => {
  let connection; // Declarar la conexión fuera del try para usarla en finally
  try {
    connection = await mysql.createConnection(dbConfig); // Crear una conexión en cada ejecución del cron
    const [rows] = await connection.execute("SELECT nivel FROM nivel1b2 ORDER BY id DESC LIMIT 1");

    if (!rows || rows.length === 0) {
      console.warn("No se pudo obtener el nivel del embalse.");
      return;
    }

    const nivelActual = rows[0].nivel; // Accede al valor de 'nivel' correctamente

    console.log(`Nivel actual del embalse 1B: ${nivelActual}`);

    if (nivelActual <= 450) {
      const mensajeAlerta = `🚨 ¡ALERTA CRÍTICA DE EMBALSE 1B! 🚨\n\nEl nivel ha descendido a *${nivelActual}*, un valor peligrosamente bajo. 📉\n\n⚠️ *Acción Inmediata Requerida:* Encender Bomba 1B para evitar un posible REBOSE. 🌊`;

      try {
        const resultEnvio = await sendMessage(phoneNumberAlerta, mensajeAlerta);
        if (resultEnvio.success) {
          console.log(`✅ Alerta de nivel bajo enviada a ${phoneNumberAlerta} (Nivel: ${nivelActual})`);
        } else {
          console.error(`❌ Error al enviar alerta de nivel bajo a ${phoneNumberAlerta} (Nivel: ${nivelActual}). Problema con sendMessage.`);
        }
      } catch (errorEnvio) {
        console.error(`❌ Error al enviar alerta de nivel bajo a ${phoneNumberAlerta} (Nivel: ${nivelActual}):`, errorEnvio);
      }
    } else if (nivelActual <= 100) {
        console.log(`⚠️ Nivel del embalse 1B bajo: ${nivelActual}. Monitoreando...`);
        // Opcional: Podrías enviar un mensaje de advertencia si quieres una alerta temprana
        // const mensajeAdvertencia = `🟡 Advertencia: Nivel del embalse 1B bajo (${nivelActual}). Favor monitorear.`;
        // await sendMessage(phoneNumberAlerta, mensajeAdvertencia);
    }

  } catch (error) {
    console.error("Error al verificar el nivel del embalse:", error);
  } finally {
    if (connection) {
      try {
        await connection.close(); // Cerrar la conexión después de cada ejecución
      } catch (err) {
        console.error("Error al cerrar la conexión:", err);
      }
    }
  }
};

// Configurar el cronjob para que se ejecute cada 5 minutos
new cron.CronJob("* * * * *", checkEmbalseNivel, null, true, "America/Tegucigalpa");

console.log("Cron job de verificación de nivel del embalse 1B iniciado para ejecutarse cada 5 minutos (credenciales DB HARCODEADAS).");