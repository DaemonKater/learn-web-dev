// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// =============================================================================
// 1. ДАННЫЕ
// =============================================================================

const MONTHS_NOMINATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

// «Сегодня» — системная дата
const now = new Date();
const TODAY = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate()
};

// Слоты времени
const BASE_SLOTS = [
    { time: '10:00', available: true },
    { time: '11:30', available: true },
    { time: '13:00', available: true },
    { time: '14:30', available: true },
    { time: '16:00', available: true },
    { time: '17:30', available: true },
    { time: '19:00', available: true }
];

// Занятые дни в октябре 2026 (по макету: «Нет мест»)
const BOOKED_DAYS_OCT_2026 = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30];

// =============================================================================
// 2. СОСТОЯНИЕ (STATE)
// =============================================================================

const state = {
    currentYear: 2026,
    currentMonth: 9,       // Октябрь (0-индексированный)
    selectedDay: 18,       // 18 октября по умолчанию
    selectedTime: '14:30', // 14:30 по умолчанию
    slots: []
};

// =============================================================================
// 3. ЧИСТЫЕ ФУНКЦИИ
// =============================================================================

function buildCalendarGrid(year, month) {
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

function compareDates(a, b) {
    const d1 = new Date(a.year, a.month, a.day);
    const d2 = new Date(b.year, b.month, b.day);
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

function isDateSelectable(day, month, year, today) {
    if (compareDates({ year, month, day }, today) < 0) {
        return false;
    }
    if (year === 2026 && month === 9 && BOOKED_DAYS_OCT_2026.includes(day)) {
        return false;
    }
    return true;
}

function getWeekdayName(year, month, day) {
    const date = new Date(year, month, day);
    return DAYS_OF_WEEK[date.getDay()];
}

function generateSlotsForDay(day) {
    return BASE_SLOTS.map(slot => ({ ...slot }));
}

// =============================================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// =============================================================================

const calendarMonthTitleEl = document.getElementById('calendarMonthTitle');
const calendarDaysEl = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

const timeCardTitleEl = document.getElementById('timeCardTitle');
const timeCardSubtitleEl = document.getElementById('timeCardSubtitle');
const timeSlotsEl = document.getElementById('timeSlots');
const visitEndNoteEl = document.getElementById('visitEndNote');

const summaryDateEl = document.getElementById('summaryDate');
const summaryTimeEl = document.getElementById('summaryTime');
const bottomBarTextEl = document.getElementById('bottomBarText');

function renderCalendar() {
    calendarMonthTitleEl.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

    const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
    let html = '';

    weeks.forEach(week => {
        week.forEach(cell => {
            if (cell.otherMonth) {
                html += `<span class="day-cell other-month">${cell.day}</span>`;
            } else {
                const selectable = isDateSelectable(cell.day, state.currentMonth, state.currentYear, TODAY);

                if (!selectable) {
                    html += `<span class="day-cell disabled">${cell.day}</span>`;
                } else {
                    const isSelected = (cell.day === state.selectedDay);
                    const selectedClass = isSelected ? ' selected' : '';
                    html += `<button class="day-cell${selectedClass}" type="button" data-day="${cell.day}">${cell.day}</button>`;
                }
            }
        });
    });

    calendarDaysEl.innerHTML = html;

    // Заново вешаем обработчики на новые кнопки
    const dayButtons = calendarDaysEl.querySelectorAll('button.day-cell');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', onDayClick);
    });
}

function onDayClick(event) {
    const day = parseInt(event.currentTarget.dataset.day, 10);
    state.selectedDay = day;

    // сброс времени при смене дня
    state.selectedTime = null;

    state.slots = generateSlotsForDay(day);

    renderCalendar();
    renderTimeSlots();
    updateSummaryAndBottomBar();
}

function renderTimeSlots() {
    if (!state.selectedDay) {
        timeCardTitleEl.textContent = 'Выберите дату';
        timeCardSubtitleEl.textContent = 'Слоты появятся после выбора дня';
        timeSlotsEl.innerHTML = '<p class="no-slots-message">Пожалуйста, выберите день в календаре</p>';
        visitEndNoteEl.textContent = 'Время визита будет рассчитано автоматически';
        return;
    }

    const weekday = getWeekdayName(state.currentYear, state.currentMonth, state.selectedDay);
    const monthGenitive = MONTHS_GENITIVE[state.currentMonth];

    timeCardTitleEl.textContent = `${state.selectedDay} ${monthGenitive}`;
    timeCardSubtitleEl.textContent = `${weekday} · ${state.slots.length} вариантов`;

    let html = '';
    state.slots.forEach(slot => {
        let classes = 'slot-item';
        if (!slot.available) classes += ' disabled';
        if (slot.time === state.selectedTime) classes += ' selected';

        const disabledAttr = !slot.available ? 'disabled' : '';
        html += `<button class="${classes}" type="button" data-time="${slot.time}" ${disabledAttr}>${slot.time}</button>`;
    });

    timeSlotsEl.innerHTML = html;

    const slotButtons = timeSlotsEl.querySelectorAll('button.slot-item:not(.disabled)');
    slotButtons.forEach(btn => {
        btn.addEventListener('click', onTimeSlotClick);
    });

    // Расчет примерного окончания визита (+ 1.5 часа)
    if (state.selectedTime) {
        const [hours, minutes] = state.selectedTime.split(':').map(Number);
        const endHour = (hours + 1 + Math.floor((minutes + 30) / 60)) % 24;
        const endMin = (minutes + 30) % 60;
        const formattedEnd = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        visitEndNoteEl.textContent = `Визит завершится примерно в ${formattedEnd}`;
    } else {
        visitEndNoteEl.textContent = 'Выберите время для расчета окончания визита';
    }
}

function onTimeSlotClick(event) {
    const time = event.currentTarget.dataset.time;
    state.selectedTime = time;

    renderTimeSlots();
    updateSummaryAndBottomBar();
}

function onPrevMonthClick() {
    if (state.currentMonth === 0) {
        state.currentMonth = 11;
        state.currentYear--;
    } else {
        state.currentMonth--;
    }

    state.selectedDay = null;
    state.selectedTime = null;
    state.slots = [];

    renderCalendar();
    renderTimeSlots();
    updateSummaryAndBottomBar();
}

function onNextMonthClick() {
    if (state.currentMonth === 11) {
        state.currentMonth = 0;
        state.currentYear++;
    } else {
        state.currentMonth++;
    }

    state.selectedDay = null;
    state.selectedTime = null;
    state.slots = [];

    renderCalendar();
    renderTimeSlots();
    updateSummaryAndBottomBar();
}

function updateSummaryAndBottomBar() {
    const monthGenitive = MONTHS_GENITIVE[state.currentMonth];

    if (state.selectedDay) {
        summaryDateEl.textContent = `${state.selectedDay} ${monthGenitive} ${state.currentYear}`;
    } else {
        summaryDateEl.textContent = 'Не выбрана';
    }

    if (state.selectedTime) {
        summaryTimeEl.textContent = state.selectedTime;
    } else {
        summaryTimeEl.textContent = 'Не выбрано';
    }

    if (state.selectedDay && state.selectedTime) {
        const weekday = getWeekdayName(state.currentYear, state.currentMonth, state.selectedDay);
        bottomBarTextEl.textContent = `${weekday}, ${state.selectedDay} ${monthGenitive} ${state.currentYear} • ${state.selectedTime}`;
    } else if (state.selectedDay) {
        const weekday = getWeekdayName(state.currentYear, state.currentMonth, state.selectedDay);
        bottomBarTextEl.textContent = `${weekday}, ${state.selectedDay} ${monthGenitive} ${state.currentYear} • выберите время`;
    } else {
        bottomBarTextEl.textContent = 'Выберите свободную дату и время';
    }
}

// =============================================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// =============================================================================

function init() {
    state.slots = generateSlotsForDay(state.selectedDay);

    prevMonthBtn.addEventListener('click', onPrevMonthClick);
    nextMonthBtn.addEventListener('click', onNextMonthClick);

    renderCalendar();
    renderTimeSlots();
    updateSummaryAndBottomBar();
}

document.addEventListener('DOMContentLoaded', init);