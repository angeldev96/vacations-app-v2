import 'dayjs/locale/es';
import dayjs from 'dayjs'; // Importa el idioma español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';

dayjs.locale('es');

const messages = {
    allDay: 'Todo el día',
    previous: 'Mes anterior',
    next: 'Siguiente mes',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`
};

export default function Calendario() {
    const localizer = dayjsLocalizer(dayjs);

    // Función para aplicar estilos a los días
    const dayPropGetter = (date) => {
        const today = dayjs().startOf('day');
        if (dayjs(date).isSame(today)) {
            return {
                style: {
                    backgroundColor: '#0093E9', // Color de fondo sólido
                    backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', // Gradiente
                    color: 'white' // Cambia el color del texto si es necesario
                }
            };
        }
        return {};
    };

    return (
        <div style={{ height: '75vh', width: '100%' }}>
            <h1>Calendario</h1>
            <Calendar
                localizer={localizer}
                messages={messages} 
                dayPropGetter={dayPropGetter} // Aplica el estilo a los días
            />
        </div>
    );
}
