// Инициализация переменных
let selectedRadius = "R13";
let srokValue = 3;
let kolValue = 4;
let diskValue = 1;

// Функция выбора радиуса
function selectRadius(radius, button) {
    // Сброс стилей у предыдущей выбранной кнопки
    document.querySelector('.radius-button.selected').classList.remove('selected');

    // Обновление переменных и стилей для новой выбранной кнопки
    selectedRadius = button.id;
    button.classList.add('selected');
    updateSumma();
}


// Функция обновления значения срока хранения
function updateSrokValue() {
    srokValue = document.getElementById('srokSlider').value;
    document.getElementById('srokValue').textContent = `${srokValue} мес.`;
    updateSumma();
}

// Функция обновления значения количества шин
function updateKolValue() {
    kolValue = document.getElementById('kolSlider').value;
    document.getElementById('kolValue').textContent = `${kolValue} шт`;
    updateSumma();
}

// Функция обновления значения тумблера "С диском"
function updateDiskValue() {
    diskValue = document.getElementById('diskToggle').checked ? 2 : 1;
    updateSumma();
}

// Функция обновления значения цены за хранение
function updateSumma() {
    const radiusValue = parseFloat(selectedRadius.slice(1)); // Преобразование строки "Rxx" в число
    const summa = Math.round(radiusValue * kolValue * srokValue * diskValue);
    document.getElementById('summa').value = `${summa} руб.`;
}

// Функция отправки формы
function submitForm() {
    // Собираем данные пользователя
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        tires: selectedRadius,
        quantity: kolValue,
        storagePeriod: `${srokValue} мес.`,
        meetingDate: document.getElementById('date').value,
        address: document.getElementById('address').value
    };

     // Отправляем заявку в Телеграм бот
    const telegramBotToken = "6473374979:AAH8OHCxWN2kO0ep9wrbLXolk2ys4__GLqg"; // Замените на реальный токен вашего бота
    const chatId = "+79780703665"; // Замените на реальный ID вашего чата

    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const message = `Имя: ${formData.name}\nТелефон: ${formData.phone}\nШины: ${formData.tires}\nКол-во: ${formData.quantity}шт\nСрок хранения: ${formData.storagePeriod}\nДата встречи: ${formData.meetingDate}\nАдрес вывоза: ${formData.address}`;

    // Формируем данные для отправки
    const requestData = {
        chat_id: chatId,
        text: message
    };

    // Отправка сообщения в Телеграм бот с использованием axios
    axios.post(telegramApiUrl, requestData, axiosConfig)
        .then(response => {
            console.log("Заявка успешно отправлена в Телеграм бот:", response.data);
            // Дополнительные действия при успешной отправке (перенаправление, показ сообщения и т.д.)
        })
        .catch(error => {
            console.error("Ошибка при отправке заявки в Телеграм бот:", error);
            // Обработка ошибок при отправке (показ сообщения об ошибке, логирование и т.д.)
        });
}
