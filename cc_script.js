document.addEventListener('DOMContentLoaded', function () {
    const radiusButtons = document.querySelectorAll('.radius-button');
    const srokSlider = document.getElementById('srokSlider');
    const kolSlider = document.getElementById('kolSlider');
    const diskToggle = document.getElementById('diskToggle');
    const summaValue = document.getElementById('summaValue');
    const dateInput = document.getElementById('dateInput');
    const phoneInput = document.getElementById('phoneInput');
    const nameInput = document.getElementById('nameInput');
    const addressInput = document.getElementById('addressInput');
    const submitBtn = document.getElementById('submitBtn');

    let selectedRadius = 125;
    let selectedSrok = 3;
    let selectedKol = 4;
    let isDiskEnabled = false;

    // Обработчик для кнопок с переменными Radius
    radiusButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedRadius = parseInt(button.dataset.radius);
            updateSumma();
            updateButtonStates(button);
        });
    });

    // Обработчик для слайдера Срока хранения
    srokSlider.addEventListener('input', () => {
        selectedSrok = parseInt(srokSlider.value);
        updateSumma();
        updateSrokValue();
    });

    // Обработчик для слайдера Количества шин
    kolSlider.addEventListener('input', () => {
        selectedKol = parseInt(kolSlider.value);
        updateSumma();
        updateKolValue();
    });

    // Обработчик для тумблера "С диском"
    diskToggle.addEventListener('change', () => {
        isDiskEnabled = diskToggle.checked;
        updateSumma();
    });

    // Обработчик для кнопки "Заказать услугу"
    submitBtn.addEventListener('click', () => {
        sendOrder();
    });

    // Функция для обновления значения переменной Summa и вывода на страницу
    function updateSumma() {
        const result = selectedRadius * selectedKol * selectedSrok * (isDiskEnabled ? 1.2 : 1);
        summaValue.textContent = result.toFixed(0);
    }

    // Функция для обновления значения переменной Srok и вывода на страницу
    function updateSrokValue() {
        document.getElementById('srokValue').textContent = selectedSrok;
    }

    // Функция для обновления значения переменной Kol и вывода на страницу
    function updateKolValue() {
        document.getElementById('kolValue').textContent = selectedKol;
    }

    // Функция для подсветки активной кнопки и обновления состояний кнопок
    function updateButtonStates(selectedButton) {
        radiusButtons.forEach(button => {
            const radiusValue = parseInt(button.dataset.radius);
            const isActive = button === selectedButton;
            button.classList.toggle('active', isActive);
        });
    }

    // Функция для отправки заявки
    async function sendOrder() {
        // Проверяем, указаны ли необходимые данные
        if (!phoneInput.value.trim() || !nameInput.value.trim()) {
            alert('Пожалуйста, заполните все обязательные поля (имя и номер телефона)!');
            return;
        }

        // Формируем текст заявки
        const orderDetails = `............................................
            Имя: ${nameInput.value}
            Телефон: ${phoneInput.value}
            ● Дата встречи: ${dateInput.value} 👈
            Адрес вывоза: ${addressInput.value}
            ● Колёса: ${selectedRadius} ➽ ${selectedKol}шт. ➽ ${isDiskEnabled ? 'С дисками' : 'Без дисков'}
            ● Срок хранения: ${selectedSrok}мес.
            ............................................
        `;

 // Ваш токен бота и ID чата получателя
    const botToken = '6473374979:AAH8OHCxWN2kO0ep9wrbLXolk2ys4__GLqg';
    const chatId = '96609347';

        // Формируем URL для отправки сообщения через API Телеграма
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        // Отправляем запрос к API Telegram для получения информации о текущем чате (для отправки сообщения обратно)
        const response = await axios.get(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`);
        const userId = response.data.result.id;

        // Отправляем сообщение в общий чат
        const commonTelegramApiParams = {
            chat_id: chatId,
            text: `📌 НОВАЯ ЗАЯВКА\n\n${orderDetails}`
        };
        await axios.post(telegramApiUrl, commonTelegramApiParams);

        // Отправляем сообщение обратно пользователю
        const userTelegramApiParams = {
            chat_id: userId,
            text: `✅Ваша заявка отправлена!
  ● ⚡Ожидайте звонка от менеджера⚡\n\n${orderDetails}`,
        };
        await axios.post(telegramApiUrl, userTelegramApiParams);

        console.log('✅Заявка успешно отправлена в Телеграм!');
    } catch (error) {
        console.error('❌Ошибка при отправке заявки в Телеграм:', error);
    }
}
});
