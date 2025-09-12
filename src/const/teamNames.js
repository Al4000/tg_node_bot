/**
 * Модуль с названиями команд
 * Содержит различные категории названий команд для футбольных матчей
 */

// Классические названия команд
const CLASSIC_NAMES = [
    'Беляши',
    'Спортак',
    'Кельма',
    'Объективные',
    'Кастрол',
    'Большие Шлемы',
    'Борцы за победу',
    'Ловкие парни',
    'Неуловимые пираты',
    'Red Bull'
];

// Агрессивные названия
const AGGRESSIVE_NAMES = [
    'Голодные звери',
    'Жаждущие крови',
    'Черная банда',
    'Безумные волки',
    'Дикие львы',
    'Монстры с клыками',
    'Древние зомби',
    'Беглые преступники',
    'Черепашки Ниндзя',
    'Синяя молния'
];

// Футбольные клубы
const FOOTBALL_CLUBS = [
    'Фиорентина',
    'Ференцварош',
    'Спортинг',
    'Депортиво',
    'Уфа',
    'Фенербахче',
    'Лейпциг',
    'Кайзерслаутерн',
    'Астон Вилла',
    'Пахтакор',
    'Ростов',
    'Шанхай Шеньхуа',
    'Олимпиакос',
    'Куинс Парк Рейнджерс',
    'Кельн',
    'Мюнхен',
    'Бавария',
    'Кировское Динамо',
    'Машиностроитель',
    'Бристоль'
];

// Смешные названия
const FUNNY_NAMES = [
    'Бродячие псы',
    'Растаманы',
    'Злые одуванчики',
    'Незаконно осужденные',
    'Пираты',
    'Команда Аскольда великого',
    'Сборная Винни пуха',
    'Попугаи',
    'Амаяк Акапян и его симсалабим',
    'Звезды 60х',
    'Ветераны заводов',
    'Best of the best',
    'Мыльные пузырики',
    'Мишки Гамми',
    'Свирепые',
    'Сборная эквадора',
    'Тиктокеры',
    'Фанаты балтики 3ки',
    'Неудержимые',
    'Кировчане',
    'Вятские',
    'Четыре танкиста и собака',
    'Озорные соловьи',
    'Трезвые слесари',
    'Большие бубенцы',
    'Списанные бабки',
    'Свирепые гномы',
    'Любители блинчиков',
    'Лукоеды',
    'Романтические кабаны',
    'Злобные быки',
    'Сытые коты',
    'Barracudes',
    'Быстроходы',
    'Kings of the world',
    'Остывшие чебуреки',
    'Горячие чебуреки',
    'Изгнанные из КБ',
    'На опыте',
    'Невыспавшиеся кабаны',
    'Вредные',
    'Случайные прохожие',
    'Стрела',
    'Торнадо',
    'Вымпел',
    'Булкоеды',
    'СССР',
    'ITALY',
    'FRANCE',
    'GERMANY',
    'ESPAÑA',
    'КиберКоты',
    'Адские Пельмени',
    'Громозеки',
    'Бешеные Слоны',
    'Шальные Кексы',
    'Соляные Гиганты',
    'Титаны из Подвала',
    'Офисные Ниндзя',
    'Чайные Драконы',
    'Шахтёры Марса',
    'Бутерброды с Громом',
    'Космические Барсуки',
    'Мемные Войны',
    'Пираты Wi-Fi',
    'Банановый Тайфун',
    'Гладиаторы из ТЦ',
    'Карамельный Апокалипсис',
    'Драконы Доставки',
    'Коты-Самураи',
    'Тролли из Чатлана',
    'Пончики с Начинкой',
    'Эльфы Района',
    'Голодные львы',
    'Бешеные собаки',
    'Пришельцы с зоны 51',
    'Бобры',
    'Заводские',
    'Бобики',
    'Барбоскины',
    'Супер футболисты',
    'Легенды футбола',
    'Быстрый пас',
    'Пассажиры автобуса N50',
    'Бэтмены',
    'Шредер и черепашки ниндзя',
    'Зуммеры',
    'Миллениалы',
    'Слуги Сталина',
    'Офицеры КГБ',
    'Объевшиеся колбасы',
    'Котики',
    'Вурдалаки',
    'Кидалы на бабки',
    'Бармалеи и чудотворец',
    'Красное - Белое',
    'Turbo bubblegum'
];

// Все названия команд
const TEAM_NAMES = [
    ...CLASSIC_NAMES,
    ...AGGRESSIVE_NAMES,
    ...FOOTBALL_CLUBS,
    ...FUNNY_NAMES
];

/**
 * Получает случайное название команды из определенной категории
 * @param {'classic'|'aggressive'|'football'|'funny'|'all'} category - Категория названий
 * @returns {string} Случайное название команды
 */
function getRandomTeamName(category = 'all') {
    const categories = {
        classic: CLASSIC_NAMES,
        aggressive: AGGRESSIVE_NAMES,
        football: FOOTBALL_CLUBS,
        funny: FUNNY_NAMES,
        all: TEAM_NAMES
    };
    
    const selectedCategory = categories[category] || TEAM_NAMES;
    return selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
}

/**
 * Получает уникальные названия команд
 * @param {number} count - Количество названий
 * @param {string} category - Категория названий
 * @returns {string[]} Массив уникальных названий
 */
function getUniqueTeamNames(count, category = 'all') {
    const categories = {
        classic: CLASSIC_NAMES,
        aggressive: AGGRESSIVE_NAMES,
        football: FOOTBALL_CLUBS,
        funny: FUNNY_NAMES,
        all: TEAM_NAMES
    };
    
    const selectedCategory = categories[category] || TEAM_NAMES;
    const shuffled = [...selectedCategory].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, selectedCategory.length));
}

/**
 * Проверяет, существует ли название команды
 * @param {string} name - Название для проверки
 * @returns {boolean} true если название существует
 */
function isTeamNameExists(name) {
    return TEAM_NAMES.includes(name);
}

/**
 * Получает количество названий команд в категории
 * @param {string} category - Категория названий
 * @returns {number} Количество названий
 */
function getTeamNamesCount(category = 'all') {
    const categories = {
        classic: CLASSIC_NAMES,
        aggressive: AGGRESSIVE_NAMES,
        football: FOOTBALL_CLUBS,
        funny: FUNNY_NAMES,
        all: TEAM_NAMES
    };
    
    const selectedCategory = categories[category] || TEAM_NAMES;
    return selectedCategory.length;
}

module.exports = {
    TEAM_NAMES,
    
    // Категоризированные названия
    CLASSIC_NAMES,
    AGGRESSIVE_NAMES,
    FOOTBALL_CLUBS,
    FUNNY_NAMES,
    
    // Функции для работы с названиями команд
    getRandomTeamName,
    getUniqueTeamNames,
    isTeamNameExists,
    getTeamNamesCount,
    
    // Экспорт по умолчанию
    default: TEAM_NAMES
};
