const cron = require("cron");
const {
  differenceInMonths,
  differenceInYears,
  differenceInDays,
  addYears,
  addMonths,
  startOfDay,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  parseISO,
  format,
  getDate,
  getMonth
} = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");
const employeeService = require('../services/employeeService');

const timeZone = "America/Tegucigalpa";

const getVacationFactor = (anioActualEmpleo) => {
  if (anioActualEmpleo === 0) return 0.8333;
  if (anioActualEmpleo === 1) return 1.0;
  if (anioActualEmpleo === 2) return 1.25;
  return 1.6667; // Si es 3 o más, aplica el factor 1.6667
};

const updateEmployeeData = async () => {
  try {
    const today = startOfDay(
      new Date(formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd HH:mm:ssXXX"))
    );
    
    const todayDay = getDate(today);
    const todayMonth = getMonth(today);
    
    console.log(`Iniciando actualización: ${today.toISOString()}`);
    console.log(`Día del mes actual: ${todayDay}, Mes actual: ${todayMonth + 1}`);

    const batchSize = 25;
    let offset = 0;
    let employees = [];

    do {
      employees = await employeeService.getEmployeesBatch(batchSize, offset);
      console.log(`Procesando lote de ${employees.length} empleados`);

      for (const employee of employees) {
        const {
          empleado_id,
          nombre,
          fecha_ingreso,
          dias_vacaciones_acumulados: vacacionesAnteriores,
          fecha_ultima_acumulacion,
          dias_vacaciones_tomados,
          anio_actual_empleo: currentYear
        } = employee;

        let ingresoDate;
        try {
          if (fecha_ingreso instanceof Date) {
            ingresoDate = startOfDay(fecha_ingreso);
          } else if (typeof fecha_ingreso === 'string') {
            ingresoDate = startOfDay(parseISO(fecha_ingreso));
          } else {
            console.error(`  Empleado ID: ${empleado_id} - Fecha de ingreso inválida: ${fecha_ingreso}`);
            continue;
          }
        } catch (error) {
          console.error(`  Empleado ID: ${empleado_id} - Error al procesar fecha de ingreso: ${error.message}`);
          continue;
        }
        
        const ingresoDayOfMonth = getDate(ingresoDate);
        const ingresoMonth = getMonth(ingresoDate);
        
        console.log(`  Empleado ID: ${empleado_id} - ${nombre}`);
        console.log(`  Fecha de ingreso: ${format(ingresoDate, 'yyyy-MM-dd')}`);
        console.log(`  Día de ingreso: ${ingresoDayOfMonth}, Mes de ingreso: ${ingresoMonth + 1}`);
        
        const isAnnualAnniversary = todayDay === ingresoDayOfMonth && todayMonth === ingresoMonth;
        const isMonthlyAnniversary = todayDay === ingresoDayOfMonth;
        
        if (!isMonthlyAnniversary && !isAnnualAnniversary) {
          console.log(`  Empleado ID: ${empleado_id} - Hoy no es día de acumulación`);
          continue;
        }

        let lastAccumulationDate;
        try {
          if (fecha_ultima_acumulacion instanceof Date) {
            lastAccumulationDate = startOfDay(fecha_ultima_acumulacion);
          } else if (typeof fecha_ultima_acumulacion === 'string') {
            lastAccumulationDate = startOfDay(parseISO(fecha_ultima_acumulacion));
          } else {
            lastAccumulationDate = ingresoDate;
          }
        } catch (error) {
          console.error(`  Empleado ID: ${empleado_id} - Error al procesar fecha de última acumulación: ${error.message}`);
          lastAccumulationDate = ingresoDate;
        }

        if (isSameDay(lastAccumulationDate, today)) {
          console.log(`  Empleado ID: ${empleado_id} - Ya fue actualizado hoy`);
          continue;
        }

        const yearsWorked = differenceInYears(today, ingresoDate);
        console.log(`  Años trabajados (calculados): ${yearsWorked}`);
        console.log(`  Años trabajados (en BD): ${currentYear}`);

        let accumulatedVacationDays = parseFloat(vacacionesAnteriores || 0);
        let newYear = currentYear;
        let newMonth = 1;

        if (isAnnualAnniversary) {
          newYear = currentYear + 1;
          newMonth = 1;
          
          const newFactor = getVacationFactor(newYear);
          console.log(`  Aniversario anual: Año ${newYear}, Nuevo factor: ${newFactor}`);
          
          accumulatedVacationDays += newFactor;
        } else if (isMonthlyAnniversary) {
          const currentFactor = getVacationFactor(currentYear);
          accumulatedVacationDays += currentFactor;
          
          const monthsSinceLastAnniversary = differenceInMonths(today, addYears(ingresoDate, currentYear));
          newMonth = (monthsSinceLastAnniversary % 12) + 1;
          
          console.log(`  Acumulación mensual: Factor ${currentFactor}, Mes del año laboral: ${newMonth}`);
        }

        accumulatedVacationDays = parseFloat(accumulatedVacationDays.toFixed(4));

        console.log(`  Resumen actualización:`);
        console.log(`  - Años trabajados: ${newYear}`);
        console.log(`  - Mes actual del año laboral: ${newMonth}`);
        console.log(`  - Días acumulados: ${accumulatedVacationDays}`);

        await employeeService.updateEmployee(
          empleado_id,
          newYear,
          newMonth,
          accumulatedVacationDays,
          today.toISOString().slice(0, 10)
        );

        console.log(`  Empleado ID: ${empleado_id} actualizado exitosamente`);
      }

      offset += batchSize;
    } while (employees.length > 0);

    console.log("Actualización de empleados completada.");
  } catch (error) {
    console.error("Error al actualizar información de empleados:", error);
  }
};

// Configurar el cronjob para que se ejecute todos los días a las 00:10 am
new cron.CronJob("10 0 * * *", updateEmployeeData, null, true, timeZone);

// Ejecutar la función inmediatamente para actualizar a los empleados
updateEmployeeData(); 