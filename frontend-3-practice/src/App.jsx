// App — корневой компонент приложения.
//
// ЗАДАНИЕ
// --------
// Перенесите свою страницу выбора даты и времени из нативного JS
// на React. У вас уже есть:
//   - готовая вёрстка (HTML);
//   - готовые стили (CSS);
//   - рабочий код на нативном JS (валидация дат, рендер календаря,
//     обработчики кликов, выбор слота).
//
// Теперь нужно то же самое сделать в React.
//
// ЧТО НУЖНО СДЕЛАТЬ
// ------------------
// 1. Разбить страницу на компоненты. Как именно — решайте сами.
//    Обычно выделяют: шапку, подвал, календарь, сетку слотов,
//    нижнюю панель.
//
// 2. Перенести вёрстку из HTML в JSX. Стили оставить как есть,
//    просто положить их в тот же проект (например, в src/styles/
//    или рядом с компонентами).
//
// 3. Заменить нативное состояние (переменные + прямые манипуляции
//    с DOM) на useState. Какие именно данные должны жить в состоянии —
//    подумайте сами. Скорее всего: текущий месяц, выбранный день,
//    выбранное время, массив слотов.
//
// 4. Рендер календаря и слотов делать через JSX и .map(),
//    без innerHTML и querySelector.
//
// 5. Обработчики кликов — через onClick прямо в JSX,
//    без addEventListener.
//
// 6. Функции для работы с датами, которые вы уже написали
//    на нативном JS (построение сетки календаря, сравнение дат,
//    проверка «не раньше сегодня»), можно переиспользовать.
//    Они чистые — не зависят от React. Создайте файл
//    src/utils/date.js и перенесите их туда.
//
//
// ПОДСКАЗКА
// ---------
// Если что-то не работает или непонятно, как перевести нативный
// код на React — вернитесь к лекции. Там разбирались все
// основные приёмы: состояние, пропсы, рендер списков, колбэки.
//
// Ниже — пустой каркас. Здесь можно начать писать.

import { useState } from 'react';
import {
    MONTHS_NOMINATIVE,
    MONTHS_GENITIVE,
    TODAY,
    BASE_SLOTS,
    buildCalendarGrid,
    isDateSelectable,
    getWeekdayName
} from './utils/date';

function App() {
    // Состояние React (useState)
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(9); // Октябрь (0-индексированный)
    const [selectedDay, setSelectedDay] = useState(18);  // По умолчанию 18 октября
    const [selectedTime, setSelectedTime] = useState('14:30'); // По умолчанию 14:30
    const [slots, setSlots] = useState(() => BASE_SLOTS.map(s => ({ ...s })));

    // Обработчик клика по дню 
    const handleDayClick = (day) => {
        setSelectedDay(day);
        setSelectedTime(null);
        setSlots(BASE_SLOTS.map(s => ({ ...s })));
    };

    // Обработчик клика по слоту времени
    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    // Листание месяцев назад
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setSelectedDay(null);
        setSelectedTime(null);
    };

    // Листание месяцев вперед
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setSelectedDay(null);
        setSelectedTime(null);
    };

    // Вычисляемые данные
    const weeks = buildCalendarGrid(currentYear, currentMonth);
    const monthGenitive = MONTHS_GENITIVE[currentMonth];
    const weekday = selectedDay ? getWeekdayName(currentYear, currentMonth, selectedDay) : '';

    // Расчет времени окончания визита (+ 1.5 часа)
    let visitEndText = 'Время визита будет рассчитано автоматически';
    if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const endHour = (hours + 1 + Math.floor((minutes + 30) / 60)) % 24;
        const endMin = (minutes + 30) % 60;
        visitEndText = `Визит завершится примерно в ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    }

    // Текст для нижней панели
    let bottomBarText = 'Выберите свободную дату и время';
    if (selectedDay && selectedTime) {
        bottomBarText = `${weekday}, ${selectedDay} ${monthGenitive} ${currentYear} • ${selectedTime}`;
    } else if (selectedDay) {
        bottomBarText = `${weekday}, ${selectedDay} ${monthGenitive} ${currentYear} • выберите время`;
    }

    return (
        <div className="page">
            {/* Шапка */}
            <header className="header">
                <div className="container header-container">
                    <div className="brand">
                        <div className="brand-logo">A</div>
                        <div className="brand-text">
                            <span className="brand-title">AURA</span>
                            <span className="brand-subtitle">BEAUTY ATELIER</span>
                        </div>
                    </div>

                    <div className="header-help">
                        <span className="help-label">Нужна помощь?</span>
                        <a href="tel:+74951201818" class="help-phone">+7 495 120-18-18</a>
                    </div>
                </div>

                {/* Степпер */}
                <nav className="stepper-nav" aria-label="Шаги записи">
                    <div className="container">
                        <div className="stepper-progress">
                            <span className="progress-bar filled" />
                            <span className="progress-bar filled" />
                            <span className="progress-bar filled" />
                            <span className="progress-bar" />
                            <span className="progress-bar" />
                        </div>
                        <ol className="stepper-list">
                            <li className="step-item completed">
                                <span className="step-badge">
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.8 6.8L9 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="step-text">Мастер</span>
                            </li>
                            <li className="step-item completed">
                                <span className="step-badge">
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.8 6.8L9 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="step-text">Услуга</span>
                            </li>
                            <li className="step-item active">
                                <span className="step-badge">3</span>
                                <span className="step-text">Дата и время</span>
                            </li>
                            <li className="step-item">
                                <span className="step-badge">4</span>
                                <span className="step-text">Контакты</span>
                            </li>
                            <li className="step-item">
                                <span className="step-badge">5</span>
                                <span className="step-text">Подтверждение</span>
                            </li>
                        </ol>
                    </div>
                </nav>
            </header>

            {/* Основная часть */}
            <main className="main">
                <div className="container">
                    <div className="page-intro">
                        <span className="step-kicker">ШАГ 3 ИЗ 5</span>
                        <h1 className="page-title">Когда вам удобно?</h1>
                        <p className="page-description">Выберите свободную дату и время. Мы зарезервируем слот на 10 минут, пока вы завершаете запись.</p>
                    </div>

                    <div className="booking-layout">
                        {/* Карточка 1: Календарь (400px) */}
                        <section className="card calendar-card">
                            <div className="card-header">
                                <div>
                                    <h2 className="card-title">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
                                    <p className="card-subtitle">Время московское</p>
                                </div>
                                <div className="calendar-arrows">
                                    <button className="arrow-btn" type="button" onClick={handlePrevMonth} aria-label="Предыдущий месяц">‹</button>
                                    <button className="arrow-btn" type="button" onClick={handleNextMonth} aria-label="Следующий месяц">›</button>
                                </div>
                            </div>

                            <div className="weekdays-grid">
                                {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((d) => (
                                    <span key={d}>{d}</span>
                                ))}
                            </div>

                            {/* Сетка дней через .map() с уникальными key */}
                            <div className="days-grid">
                                {weeks.map((week, wIdx) =>
                                    week.map((cell, cIdx) => {
                                        const key = `${wIdx}-${cIdx}`;

                                        if (cell.otherMonth) {
                                            return <span key={key} className="day-cell other-month">{cell.day}</span>;
                                        }

                                        const selectable = isDateSelectable(cell.day, currentMonth, currentYear, TODAY);
                                        if (!selectable) {
                                            return <span key={key} className="day-cell disabled">{cell.day}</span>;
                                        }

                                        const isSelected = cell.day === selectedDay;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`day-cell ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleDayClick(cell.day)}
                                            >
                                                {cell.day}
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            <div className="calendar-legend">
                                <span className="legend-item">
                                    <span className="legend-dot available" />
                                    Есть время
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot unavailable" />
                                    Нет мест
                                </span>
                            </div>
                        </section>

                        {/* Карточка 2: Слоты времени (180px) */}
                        <section className="card time-card">
                            <div className="card-header">
                                <div>
                                    <h2 className="card-title">
                                        {selectedDay ? `${selectedDay} ${monthGenitive}` : 'Выберите дату'}
                                    </h2>
                                    <p className="card-subtitle">
                                        {selectedDay ? `${weekday} · ${slots.length} вариантов` : 'Слоты появятся после выбора дня'}
                                    </p>
                                </div>
                            </div>

                            <div className="slots-list">
                                {selectedDay ? (
                                    slots.map((slot) => {
                                        const isSelected = slot.time === selectedTime;
                                        const isDisabled = !slot.available;
                                        return (
                                            <button
                                                key={slot.time}
                                                type="button"
                                                disabled={isDisabled}
                                                className={`slot-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                                onClick={() => handleTimeClick(slot.time)}
                                            >
                                                {slot.time}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="no-slots-message">Пожалуйста, выберите свободный день в календаре</p>
                                )}
                            </div>

                            <div className="time-footer-note">
                                <svg className="note-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{visitEndText}</span>
                            </div>
                        </section>

                        {/* Карточка 3: Ваша запись (235px) */}
                        <aside className="card summary-card">
                            <div className="summary-header">
                                <h2 className="card-title">Ваша запись</h2>
                                <span className="badge-draft">ЧЕРНОВИК</span>
                            </div>

                            <dl className="summary-list">
                                <div className="summary-row">
                                    <dt>Мастер</dt>
                                    <dd>Анна Лебедева</dd>
                                </div>
                                <div className="summary-row">
                                    <dt>Услуга</dt>
                                    <dd>Авторская стрижка</dd>
                                </div>
                                <div className="summary-row">
                                    <dt>Дата</dt>
                                    <dd>{selectedDay ? `${selectedDay} ${monthGenitive} ${currentYear}` : 'Не выбрана'}</dd>
                                </div>
                                <div className="summary-row">
                                    <dt>Время</dt>
                                    <dd>{selectedTime || 'Не выбрано'}</dd>
                                </div>
                            </dl>

                            <div className="summary-divider" />

                            <div className="summary-total-row">
                                <span className="total-label">Итого</span>
                                <span className="total-price">5 500 ₽</span>
                            </div>

                            <div className="summary-guarantee">
                                <svg className="guarantee-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <span>Оплата после визита. Перенос без штрафа за 12 часов.</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Подвал */}
            <footer className="footer">
                <div className="container footer-container">
                    <a href="#" className="back-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>К услугам</span>
                    </a>

                    <div className="footer-actions">
                        <div className="bottom-selection-info">
                            <svg className="timer-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="13" r="8" />
                                <path d="M12 9v4l2 2" />
                                <path d="M5 3L2 6" />
                                <path d="M22 6l-3-3" />
                                <path d="M10 2h4" />
                            </svg>
                            <span>{bottomBarText}</span>
                        </div>

                        <button className="btn-continue" type="button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                            <span>Продолжить</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;