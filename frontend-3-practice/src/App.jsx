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
import { TODAY, getSlotsForDate, MONTHS_GENITIVE } from './utils/date';
import CalendarCard from './components/CalendarCard';
import TimeSlotsCard from './components/TimeSlotsCard';
import SummaryCard from './components/SummaryCard';
import BottomBar from './components/BottomBar';

function App() {
    const [currentYear, setCurrentYear] = useState(TODAY.year);
    const [currentMonth, setCurrentMonth] = useState(TODAY.month);
    const [selectedDay, setSelectedDay] = useState(TODAY.day);
    const [selectedTime, setSelectedTime] = useState(null);
    const [slots, setSlots] = useState(() => getSlotsForDate(TODAY.year, TODAY.month, TODAY.day, TODAY));

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setSelectedTime(null);
        setSlots(getSlotsForDate(currentYear, currentMonth, day, TODAY));
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setSelectedDay(null);
        setSelectedTime(null);
        setSlots([]);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setSelectedDay(null);
        setSelectedTime(null);
        setSlots([]);
    };

    const handleContinue = () => {
        if (selectedDay && selectedTime) {
            alert(`Запись оформлена на ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear} в ${selectedTime}`);
        }
    };

    return (
        <div className="page">
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
                        <a href="tel:+74951201818" className="help-phone">+7 495 120-18-18</a>
                    </div>
                </div>

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

            <main className="main">
                <div className="container">
                    <div className="page-intro">
                        <span className="step-kicker">ШАГ 3 ИЗ 5</span>
                        <h1 className="page-title">Когда вам удобно?</h1>
                        <p className="page-description">Выберите свободную дату и время. Мы зарезервируем слот на 10 минут, пока вы завершаете запись.</p>
                    </div>

                    <div className="booking-layout">
                        <CalendarCard
                            currentYear={currentYear}
                            currentMonth={currentMonth}
                            selectedDay={selectedDay}
                            onSelectDay={handleDayClick}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            today={TODAY}
                        />

                        <TimeSlotsCard
                            slots={slots}
                            selectedDay={selectedDay}
                            selectedTime={selectedTime}
                            onSelectTime={handleTimeClick}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                        />

                        <SummaryCard
                            selectedDay={selectedDay}
                            selectedTime={selectedTime}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                        />
                    </div>
                </div>
            </main>

            <BottomBar
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                currentMonth={currentMonth}
                currentYear={currentYear}
                onContinue={handleContinue}
            />
        </div>
    );
}

export default App;