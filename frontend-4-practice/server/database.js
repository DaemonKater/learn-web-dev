export const database = {
    // «Сегодня» по мнению сервера: 17 октября 2026 (месяц 9 = октябрь)
    today: { day: 17, month: 9, year: 2026 },

    // Слоты для чётных дней
    slotsEvenDay: [
        { time: '10:00', available: true },
        { time: '11:30', available: true },
        { time: '13:00', available: true },
        { time: '14:30', available: true },
        { time: '16:00', available: true },
        { time: '17:30', available: true },
        { time: '19:00', available: true }
    ],

    // Слоты для нечётных дней (часть занята для проверки смены слотов)
    slotsOddDay: [
        { time: '10:00', available: true },
        { time: '11:30', available: false },
        { time: '13:00', available: true },
        { time: '14:30', available: true },
        { time: '16:00', available: false },
        { time: '17:30', available: true },
        { time: '19:00', available: true }
    ]
};