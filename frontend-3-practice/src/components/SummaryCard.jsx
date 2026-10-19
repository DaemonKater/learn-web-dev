import { MONTHS_GENITIVE } from '../utils/date';

function SummaryCard({ selectedDay, selectedTime, currentMonth, currentYear }) {
    const monthGenitive = MONTHS_GENITIVE[currentMonth];

    return (
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
    );
}

export default SummaryCard;