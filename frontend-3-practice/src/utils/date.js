export const MONTHS_NOMINATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const DAYS_OF_WEEK = [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

const now = new Date();
export const TODAY = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate()
};

export const BASE_SLOTS = [
    { time: '10:00', available: true },
    { time: '11:30', available: true },
    { time: '13:00', available: true },
    { time: '14:30', available: true },
    { time: '16:00', available: true },
    { time: '17:30', available: true },
    { time: '19:00', available: true }
];

export function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = offset - 1; i >= 0; i--) {
        cells.push({ day: prevMonthLastDay - i, otherMonth: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, otherMonth: false });
    }

    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells) {
        cells.push({ day: nextDay, otherMonth: true });
        nextDay++;
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

export function compareDates(a, b) {
    if (!a || !b) return 0;
    const d1 = new Date(a.year, a.month, a.day);
    const d2 = new Date(b.year, b.month, b.day);
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

export function isDateSelectable(day, month, year, today) {
    if (!today) return true;
    return compareDates({ year, month, day }, today) >= 0;
}

export function getWeekdayName(year, month, day) {
    const date = new Date(year, month, day);
    return DAYS_OF_WEEK[date.getDay()];
}

export function getSlotsForDate(year, month, day, today = TODAY) {
    const currentDate = new Date();
    const isToday =
        today &&
        year === today.year &&
        month === today.month &&
        day === today.day;

    return BASE_SLOTS.map((slot) => {
        if (isToday) {
            const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
            const isPastTime =
                slotHours < currentDate.getHours() ||
                (slotHours === currentDate.getHours() && slotMinutes <= currentDate.getMinutes());

            return {
                ...slot,
                available: slot.available && !isPastTime
            };
        }
        return { ...slot };
    });
}