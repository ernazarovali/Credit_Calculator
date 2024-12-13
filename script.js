document.getElementById('calculateButton').addEventListener('click', function () {
    // Получение данных из формы
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100 / 12; // месячная процентная ставка
    const term = parseInt(document.getElementById('term').value);
    const type = document.getElementById('type').value;

    // Проверка корректности данных
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || term <= 0) {
        alert('Пожалуйста, введите корректные данные');
        return;
    }

    let monthlyPayment;
    let payments = [];

    if (type === 'annuity') {
        // Расчет аннуитетного платежа
        monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);

        // Генерация данных для таблицы
        let remainingDebt = amount;
        for (let i = 1; i <= term; i++) {
            const interest = remainingDebt * rate;
            const principal = monthlyPayment - interest;
            remainingDebt -= principal;

            payments.push({
                month: i,
                payment: monthlyPayment,
                principal: principal,
                interest: interest,
                remaining: Math.max(remainingDebt, 0),
            });
        }
    } else if (type === 'differential') {
        // Расчет дифференцированного платежа
        const principal = amount / term;

        for (let i = 1; i <= term; i++) {
            const interest = (amount - (principal * (i - 1))) * rate;
            const payment = principal + interest;

            payments.push({
                month: i,
                payment: payment,
                principal: principal,
                interest: interest,
                remaining: Math.max(amount - (principal * i), 0),
            });
        }

        monthlyPayment = payments[0].payment; // Первый платеж как максимальный
    }

    // Отображение результата
    document.getElementById('monthlyPayment').textContent = monthlyPayment.toFixed(2);
    document.getElementById('detailsButton').style.display = 'block';

    // Обработчик для кнопки "Подробнее"
    document.getElementById('detailsButton').addEventListener('click', function () {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Очистка предыдущих данных

        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.month}</td>
                <td>${payment.payment.toFixed(2)}</td>
                <td>${payment.principal.toFixed(2)}</td>
                <td>${payment.interest.toFixed(2)}</td>
                <td>${payment.remaining.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('detailsTable').style.display = 'block';
    });
});
