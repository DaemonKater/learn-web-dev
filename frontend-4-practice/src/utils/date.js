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

// Занятые дни в октябре 2026 (по макету AURA: «Нет мест»)
export const BOOKED_DAYS_OCT_2026 = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30];

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
    if (today && compareDates({ year, month, day }, today) < 0) {
        return false;
    }
    if (year === 2026 && month === 9 && BOOKED_DAYS_OCT_2026.includes(day)) {
        return false;
    }
    return true;
}

export function getWeekdayName(year, month, day) {
    const date = new Date(year, month, day);
    return DAYS_OF_WEEK[date.getDay()];
}