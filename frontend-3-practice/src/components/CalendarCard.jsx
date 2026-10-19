import { MONTHS_NOMINATIVE, buildCalendarGrid, isDateSelectable } from '../utils/date';

function CalendarCard({
    currentYear,
    currentMonth,
    selectedDay,
    onSelectDay,
    onPrevMonth,
    onNextMonth,
    today
}) {
    const weeks = buildCalendarGrid(currentYear, currentMonth);

    return (
        <section className="card calendar-card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
                    <p className="card-subtitle">Время московское</p>
                </div>
                <div className="calendar-arrows">
                    <button className="arrow-btn" type="button" onClick={onPrevMonth} aria-label="Предыдущий месяц">‹</button>
                    <button className="arrow-btn" type="button" onClick={onNextMonth} aria-label="Следующий месяц">›</button>
                </div>
            </div>

            <div className="weekdays-grid">
                {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((d) => (
                    <span key={d}>{d}</span>
                ))}
            </div>

            <div className="days-grid">
                {weeks.map((week, wIdx) =>
                    week.map((cell, cIdx) => {
                        const key = `${wIdx}-${cIdx}`;

                        if (cell.otherMonth) {
                            return <span key={key} className="day-cell other-month">{cell.day}</span>;
                        }

                        const selectable = isDateSelectable(cell.day, currentMonth, currentYear, today);
                        if (!selectable) {
                            return <span key={key} className="day-cell disabled">{cell.day}</span>;
                        }

                        const isSelected = cell.day === selectedDay;
                        return (
                            <button
                                key={key}
                                type="button"
                                className={`day-cell ${isSelected ? 'selected' : ''}`}
                                onClick={() => onSelectDay(cell.day)}
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
    );
}

export default CalendarCard;