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
            updateButtonStates();
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
        const result = selectedRadius * selectedKol * selectedSrok * (isDiskEnabled ? 2 : 1);
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
    function updateButtonStates() {
        radiusButtons.forEach(button => {
            const radiusValue = parseInt(button.dataset.radius);
            button.classList.toggle('active', radiusValue === selectedRadius);
        });
    }

   // Функция для отправки заявки
    async function sendOrder() {
        const orderDetails = `
            *Новая Заявка*
            Имя: ${nameInput.value}
            Телефон: ``${phoneInput.value}``
            Шины: R${selectedRadius}
            Кол-во: ${selectedKol} шт.
            Срок хранения: ${selectedSrok} мес.
            ● Дата встречи: *${dateInput.value}*
            Адрес вывоза: ${addressInput.value}
        `;

        // Ваш токен бота и ID чата получателя
        const botToken = '6473374979:AAH8OHCxWN2kO0ep9wrbLXolk2ys4__GLqg';
        const chatId = '96609347';

        // Формируем URL для отправки сообщения через API Телеграма
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramApiParams = {
            chat_id: chatId,
            text: orderDetails,
        };

        try {
            // Отправляем запрос к API Телеграма
            await axios.post(telegramApiUrl, telegramApiParams);

            // Опционально: обновляем UI или выводим сообщение об успешной отправке
            console.log('Заявка успешно отправлена в Телеграм!');
        } catch (error) {
            // Обработка ошибок, например, вывод в консоль
            console.error('Ошибка при отправке заявки в Телеграм:', error);
        }
    }
});
