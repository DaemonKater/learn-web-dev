import { MONTHS_GENITIVE, getWeekdayName } from '../utils/date';

function TimeSlotsCard({
    slots,
    selectedDay,
    selectedTime,
    onSelectTime,
    currentMonth,
    currentYear
}) {
    const monthGenitive = MONTHS_GENITIVE[currentMonth];
    const weekday = selectedDay ? getWeekdayName(currentYear, currentMonth, selectedDay) : '';

    let visitEndText = 'Время визита будет рассчитано автоматически';
    if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const endHour = (hours + 1 + Math.floor((minutes + 30) / 60)) % 24;
        const endMin = (minutes + 30) % 60;
        visitEndText = `Визит завершится примерно в ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    }

    return (
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
                                onClick={() => slot.available && onSelectTime(slot.time)}
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
    );
}

export default TimeSlotsCard;