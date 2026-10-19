import { MONTHS_GENITIVE, getWeekdayName } from '../utils/date';

function BottomBar({ selectedDay, selectedTime, currentMonth, currentYear, onContinue }) {
    const monthGenitive = MONTHS_GENITIVE[currentMonth];
    const weekday = selectedDay ? getWeekdayName(currentYear, currentMonth, selectedDay) : '';

    const isComplete = Boolean(selectedDay && selectedTime);

    let bottomBarText = 'Выберите свободную дату и время';
    if (selectedDay && selectedTime) {
        bottomBarText = `${weekday}, ${selectedDay} ${monthGenitive} ${currentYear} • ${selectedTime}`;
    } else if (selectedDay) {
        bottomBarText = `${weekday}, ${selectedDay} ${monthGenitive} ${currentYear} • выберите время`;
    }

    return (
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

                    <button
                        className="btn-continue"
                        type="button"
                        disabled={!isComplete}
                        onClick={onContinue}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                        <span>Продолжить</span>
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default BottomBar;