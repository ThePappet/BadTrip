// =========================
// INDEX PAGE LOGIC
// =========================

const difficultySelect = document.getElementById("difficulty");
const customSettings = document.getElementById("customSettings");
const startGameBtn = document.getElementById("startGameBtn");
const disclaimerModal = document.getElementById("disclaimerModal");
const confirmDisclaimer = document.getElementById("confirmDisclaimer");

let pendingGameState = null;

// =========================
// SHOP DATA
// =========================

const shopItems = {

    cannabis_seeds: {
        name: "Семена конопли",
        price: 10
    },

    rolling_paper: {
        name: "Бумага для самокруток",
        price: 2
    },

    coca_leaves: {
        name: "Листья коки",
        price: 30
    },

    mushroom_spores: {
        name: "Споры грибов",
        price: 15
    },

    raw_morphine: {
        name: "Морфий-сырец",
        price: 80
    },

    methyl_acid: {
        name: "Метиловая кислота",
        price: 150
    },

    basic_chemistry_kit: {
        name: "Любительский набор химии",
        price: 15
    },

    student_chemistry_kit: {
        name: "Студенческий набор химии",
        price: 50
    },

    professional_chemistry_kit: {
        name: "Профессиональный набор химии",
        price: 120
    }

};

// =========================
// RECIPES
// =========================

const recipes = {

    marijuana: {
        name: "Марихуана",
        time: 2,
        requiresLab: false,

        ingredients: {
            cannabis_seeds: 1,
            rolling_paper: 1
        }
    },

    cocaine: {
        name: "Очищенный кокаин",
        time: 1,
        requiresLab: false,

        ingredients: {
            coca_leaves: 1
        }
    },

    mushrooms: {
        name: "Галлюциногенные грибы",
        time: 3,
        requiresLab: false,

        ingredients: {
            mushroom_spores: 1
        }
    },

    crack: {
        name: "Крэк",
        time: 1,
        requiresLab: true,

        ingredients: {
            cocaine: 1,
            basic_chemistry_kit: 1
        }
    },

    amphetamine: {
        name: "Амфетамин",
        time: 1,
        requiresLab: true,

        ingredients: {
            student_chemistry_kit: 1
        }
    },

    methamphetamine: {
        name: "Метамфетамин",
        time: 2,
        requiresLab: true,

        ingredients: {
            student_chemistry_kit: 1,
            methyl_acid: 1
        }
    },

    mephedrone: {
        name: "Мефедрон",
        time: 1,
        requiresLab: true,

        ingredients: {
            student_chemistry_kit: 1,
            basic_chemistry_kit: 1
        }
    },

    heroin: {
        name: "Героин",
        time: 2,
        requiresLab: true,

        ingredients: {
            raw_morphine: 1,
            student_chemistry_kit: 1
        }
    },

    oxycodone: {
        name: "Оксикодон",
        time: 3,
        requiresLab: true,

        ingredients: {
            raw_morphine: 1,
            professional_chemistry_kit: 1
        }
    },

    lsd: {
        name: "ЛСД",
        time: 3,
        requiresLab: true,

        ingredients: {
            mushrooms: 1,
            professional_chemistry_kit: 1
        }
    },

    fentanyl: {
        name: "Фентанил",
        time: 2,
        requiresLab: true,

        ingredients: {
            raw_morphine: 1,
            basic_chemistry_kit: 1,
            student_chemistry_kit: 1,
            professional_chemistry_kit: 1
        }
    }

};

// =========================
// SELL DATA
// =========================

const sellData = {

    marijuana: {
        name: "Марихуана",
        costPrice: 12
    },

    cocaine: {
        name: "Кокаин",
        costPrice: 30
    },

    mushrooms: {
        name: "Грибы",
        costPrice: 15
    },

    crack: {
        name: "Крэк",
        costPrice: 45
    },

    amphetamine: {
        name: "Амфетамин",
        costPrice: 50
    },

    methamphetamine: {
        name: "Метамфетамин",
        costPrice: 200
    },

    mephedrone: {
        name: "Мефедрон",
        costPrice: 65
    },

    heroin: {
        name: "Героин",
        costPrice: 130
    },

    oxycodone: {
        name: "Оксикодон",
        costPrice: 200
    },

    lsd: {
        name: "ЛСД",
        costPrice: 135
    },

    fentanyl: {
        name: "Фентанил",
        costPrice: 265
    }

};

// =========================
// GLOBAL EVENTS
// =========================

const globalEffects = {

    inflationDays: 0,
    competitorDays: 0,
    recommendationDays: 0

};

// Показ кастомных настроек
if (difficultySelect) {

    difficultySelect.addEventListener("change", () => {

        if (difficultySelect.value === "custom") {
            customSettings.classList.remove("hidden");
        } else {
            customSettings.classList.add("hidden");
        }

    });

}

// Открытие дисклеймера
if (startGameBtn) {

    startGameBtn.addEventListener("click", () => {

        const playerName =
            document.getElementById("playerName")
                .value
                .trim();

        // Имя обязательно
        if (playerName.length < 2) {

            alert(
                "Введите имя игрока (минимум 2 символа)."
            );

            return;

        }

        const difficulty =
            difficultySelect.value;

        let daysLeft = 30;
        let targetGoal = 5000;
        let startMoney = 800;

        switch (difficulty) {

            case "easy":
                daysLeft = 40;
                targetGoal = 3000;
                startMoney = 450;
                break;

            case "medium":
                daysLeft = 30;
                targetGoal = 5000;
                startMoney = 300;
                break;

            case "hard":
                daysLeft = 20;
                targetGoal = 8000;
                startMoney = 180;
                break;

            case "endless":
                daysLeft = 999999;
                targetGoal = 999999;
                startMoney = 350;
                break;

            case "custom":

                daysLeft =
                    parseInt(
                        document.getElementById("customDays").value
                    ) || 30;

                targetGoal =
                    parseInt(
                        document.getElementById("customGoal").value
                    ) || 5000;

                startMoney = 250;

                break;
        }

        // Полностью удаляем старое сохранение
        localStorage.removeItem("badtrip_save");

        // Создание нового состояния игры
        pendingGameState = {

            playerName,
            difficulty,

            currentDay: 1,
            daysLeft,

            money: startMoney,
            targetGoal,

            energy: 100,

            wantedLevel: 0,

            labUnlocked: false,

            inventory: {
                ingredients: {},
                products: {}
            },

            productionQueue: [],

            marketListings: {},

            noSellDays: 0

        };

        // Показываем дисклеймер
        disclaimerModal.classList.remove("hidden");

    });

}

// Подтверждение дисклеймера
if (confirmDisclaimer) {

    confirmDisclaimer.addEventListener("click", () => {

        // Проверка
        if (!pendingGameState) {

            alert("Ошибка создания новой игры.");
            return;

        }

        try {

            // Полностью очищаем старый сейв
            localStorage.removeItem("badtrip_save");

            // Сохраняем новый
            localStorage.setItem(
                "badtrip_save",
                JSON.stringify(pendingGameState)
            );

            // Проверяем запись
            const saved =
                localStorage.getItem("badtrip_save");

            if (!saved) {

                alert("Не удалось сохранить игру.");
                return;

            }

            // Небольшая задержка
            setTimeout(() => {

                window.location.href = "main.html";

            }, 100);

        } catch (error) {

            console.error(error);

            alert(
                "Ошибка localStorage. Попробуйте запуск через Live Server."
            );

        }

    });

}

// =========================
// MAIN PAGE LOGIC
// =========================

let gameState = null;

// Загрузка игры
function loadGame() {

    const savedData =
        localStorage.getItem("badtrip_save");

    // Нет сохранения
    if (!savedData) {

        alert("Сохранение игры не найдено.");

        window.location.href = "index.html";

        return;

    }

    try {

        gameState = JSON.parse(savedData);

    } catch (error) {

        alert("Поврежденное сохранение.");

        localStorage.removeItem("badtrip_save");

        window.location.href = "index.html";

        return;

    }

    // Проверка имени
    if (
        !gameState.playerName ||
        gameState.playerName.length < 2
    ) {

        alert("Некорректное имя игрока.");

        localStorage.removeItem("badtrip_save");

        window.location.href = "index.html";

        return;

    }

    // Защита структуры
    if (!gameState.inventory) {

        gameState.inventory = {
            ingredients: {},
            products: {}
        };

    }

    if (!gameState.productionQueue) {
        gameState.productionQueue = [];
    }

    if (!gameState.marketListings) {
        gameState.marketListings = {};
    }

    if (gameState.noSellDays === undefined) {
        gameState.noSellDays = 0;
    }

    if (gameState.money === undefined) {
        gameState.money = 800;
    }

    // Обновление интерфейса
    updateUI();

}

// Обновление интерфейса
function updateUI() {

    document.getElementById("uiPlayerName").textContent =
        gameState.playerName;

    document.getElementById("uiDay").textContent =
        gameState.currentDay;

    document.getElementById("uiDaysLeft").textContent =
        gameState.daysLeft;

    document.getElementById("uiMoney").textContent =
        `$${gameState.money}`;

    document.getElementById("uiGoal").textContent =
        `$${gameState.targetGoal}`;

    document.getElementById("uiEnergy").textContent =
        gameState.energy;

    // Обновление склада
    for (const itemId in shopItems) {

        const stockElement =
            document.getElementById(`stock-${itemId}`);

        if (!stockElement) continue;

        const amount =
            gameState.inventory.ingredients[itemId] || 0;

        stockElement.textContent = amount;

    }

    // Обновление лаборатории
    const labUpgradeContainer =
        document.getElementById("labUpgradeContainer");

    if (labUpgradeContainer) {

        if (gameState.labUnlocked) {

            labUpgradeContainer.innerHTML = `
                <div class="lab-unlocked">
                    Лаборатория разблокирована
                </div>
            `;

        } else {

            labUpgradeContainer.innerHTML = `
                <button
                    id="unlockLabBtn"
                    class="danger-btn"
                    onclick="unlockLab()"
                >
                    Купить
                </button>
            `;

        }

    }

    // =========================
    // PRODUCTION QUEUE UI
    // =========================

    const productionQueue =
        document.getElementById("productionQueue");

    if (productionQueue) {

        productionQueue.innerHTML = "";

        if (gameState.productionQueue.length <= 0) {

            productionQueue.innerHTML = `
            <p class="empty-production">
                Производство отсутствует.
            </p>
        `;

        } else {

            gameState.productionQueue.forEach(production => {

                const div = document.createElement("div");

                div.classList.add("production-item");

                div.innerHTML = `
                <strong>${production.name}</strong>
                <p>Осталось дней: ${production.daysLeft}</p>
            `;

                productionQueue.appendChild(div);

            });

        }

    }

    // =========================
    // LAB BUTTONS
    // =========================

    const tier2Buttons =
        document.querySelectorAll(".tier2-btn");

    tier2Buttons.forEach(button => {

        if (gameState.labUnlocked) {

            button.disabled = false;
            button.textContent = "Запустить производство";

        } else {

            button.disabled = true;
            button.textContent = "Требуется Лаборатория";

        }

    });

    // =========================
    // WANTED STARS
    // =========================

    const stars =
        document.querySelectorAll(".wanted-star");

    stars.forEach((star, index) => {

        if (index < gameState.wantedLevel) {

            star.classList.add("active");

        } else {

            star.classList.remove("active");

        }

    });

    renderMarket();

}

// =========================
// MARKET UI
// =========================

function renderMarket() {

    const marketContainer =
        document.getElementById("marketContainer");

    if (!marketContainer) return;

    marketContainer.innerHTML = "";

    for (const productId in sellData) {

        const product =
            sellData[productId];

        const amount =
            gameState.inventory.products[productId] || 0;

        const recipe =
            recipes[productId];

        const recPrice =
            Math.round(
                product.costPrice *
                (1 + recipe.time)
            );

        const listing =
            gameState.marketListings[productId] || {

                enabled: false,
                price: recPrice,
                dealerPercent: 15

            };

        const div =
            document.createElement("div");

        div.classList.add("market-item");

        if (amount <= 0) {
            div.classList.add("disabled");
        }

        div.innerHTML = `

            <h3>${product.name}</h3>

            <p>
                На складе: ${amount} шт
            </p>

            <p>
                Рекомендуемая цена:
                $${recPrice}
            </p>

            <div class="market-row">

                <div class="market-field">
                    <label>Твоя цена</label>

                    <input
                        type="number"
                        value="${listing.price}"
                        min="1"

                        onchange="
                            updateListing(
                                '${productId}',
                                'price',
                                this.value
                            )
                        "

                        ${amount <= 0 ? "disabled" : ""}
                    >
                </div>

                <div class="market-field">
                    <label>% барыгам</label>

                    <input
                        type="number"
                        value="${listing.dealerPercent}"

                        min="5"
                        max="50"

                        onchange="
                            updateListing(
                                '${productId}',
                                'dealerPercent',
                                this.value
                            )
                        "

                        ${amount <= 0 ? "disabled" : ""}
                    >
                </div>

            </div>

            <div class="market-checkbox">

                <label>

                    <input
                        type="checkbox"

                        ${listing.enabled ? "checked" : ""}

                        onchange="
                            updateListing(
                                '${productId}',
                                'enabled',
                                this.checked
                            )
                        "

                        ${amount <= 0 ? "disabled" : ""}
                    >

                    Выставить на продажу сегодня

                </label>

            </div>

        `;

        marketContainer.appendChild(div);

    }

}

// =========================
// UPDATE LISTING
// =========================

function updateListing(productId, field, value) {

    if (!gameState.marketListings[productId]) {

        gameState.marketListings[productId] = {

            enabled: false,
            price: 1,
            dealerPercent: 15

        };

    }

    gameState.marketListings[productId][field] = value;

    localStorage.setItem(
        "badtrip_save",
        JSON.stringify(gameState)
    );

}

// =========================
// TABS
// =========================

const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".tab-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".tab-content")
            .forEach(tab => tab.classList.remove("active"));

        button.classList.add("active");

        const tabId = button.dataset.tab;

        document.getElementById(tabId)
            .classList.add("active");

    });

});

// =========================
// LOG SYSTEM
// =========================

function addLog(text) {

    const log = document.getElementById("gameLog");

    if (!log) return;

    const p = document.createElement("p");

    p.textContent = text;

    log.prepend(p);

}

// =========================
// BUY ITEM
// =========================

function buyItem(itemId) {

    const item = shopItems[itemId];

    if (!item) return;

    // Проверка денег
    if (gameState.money < item.price) {

        addLog(
            `Недостаточно денег для покупки: ${item.name}.`
        );

        return;

    }

    // Списание денег
    gameState.money -= item.price;

    // Создание ячейки склада
    if (!gameState.inventory.ingredients[itemId]) {

        gameState.inventory.ingredients[itemId] = 0;

    }

    // Добавление предмета
    gameState.inventory.ingredients[itemId] += 1;

    addLog(
        `Куплен товар: ${item.name} (-$${item.price}).`
    );

    // Сохранение
    localStorage.setItem(
        "badtrip_save",
        JSON.stringify(gameState)
    );

    // Обновление интерфейса
    updateUI();

}

// =========================
// UNLOCK LAB
// =========================

function unlockLab() {

    // Уже куплено
    if (gameState.labUnlocked) {
        return;
    }

    // Проверка денег
    if (gameState.money < 500) {

        addLog(
            "Недостаточно денег для покупки лаборатории."
        );

        return;

    }

    // Покупка
    gameState.money -= 500;

    gameState.labUnlocked = true;

    addLog(
        "Вы приобрели подпольную лабораторию."
    );

    // Сохранение
    localStorage.setItem(
        "badtrip_save",
        JSON.stringify(gameState)
    );

    // Обновление интерфейса
    updateUI();

}

// =========================
// START PRODUCTION
// =========================

function startProduction(recipeId) {

    const recipe = recipes[recipeId];

    if (!recipe) return;

    // Проверка лаборатории
    if (recipe.requiresLab && !gameState.labUnlocked) {

        addLog(
            "Для этого рецепта требуется лаборатория."
        );

        return;

    }

    // Проверка энергии
    if (gameState.energy < 15) {

        addLog(
            "Недостаточно энергии для производства."
        );

        return;

    }

    // Проверка ингредиентов
    for (const ingredient in recipe.ingredients) {

        const requiredAmount =
            recipe.ingredients[ingredient];

        // Проверка в ингредиентах
        const ingredientAmount =
            gameState.inventory.ingredients[ingredient] || 0;

        // Проверка в готовой продукции
        const productAmount =
            gameState.inventory.products[ingredient] || 0;

        const totalAmount =
            ingredientAmount + productAmount;

        if (totalAmount < requiredAmount) {

            addLog(
                `Недостаточно ингредиентов для: ${recipe.name}.`
            );

            return;

        }

    }

    // Списание ингредиентов
    for (const ingredient in recipe.ingredients) {

        let requiredAmount =
            recipe.ingredients[ingredient];

        // Сначала тратим ингредиенты
        if (gameState.inventory.ingredients[ingredient]) {

            const available =
                gameState.inventory.ingredients[ingredient];

            const used =
                Math.min(available, requiredAmount);

            gameState.inventory.ingredients[ingredient] -= used;

            requiredAmount -= used;

        }

        // Потом готовую продукцию
        if (
            requiredAmount > 0 &&
            gameState.inventory.products[ingredient]
        ) {

            gameState.inventory.products[ingredient] -= requiredAmount;

        }

    }

    // Списание энергии
    gameState.energy -= 15;

    // Добавление в очередь
    gameState.productionQueue.push({

        recipeId,
        name: recipe.name,
        daysLeft: recipe.time

    });

    addLog(
        `Производство "${recipe.name}" запущено.`
    );

    localStorage.setItem(
        "badtrip_save",
        JSON.stringify(gameState)
    );

    updateUI();

}

// =========================
// NEXT DAY
// =========================

function nextDay() {

    playDayTransition(() => {

        gameState.currentDay += 1;
        gameState.daysLeft -= 1;
        gameState.energy -= 10;

        addLog(`Прошел день ${gameState.currentDay}.`);

        // =========================
        // ПРОИЗВОДСТВО
        // =========================

        for (
            let i = gameState.productionQueue.length - 1;
            i >= 0;
            i--
        ) {

            const production =
                gameState.productionQueue[i];

            production.daysLeft -= 1;

            if (production.daysLeft <= 0) {

                if (
                    !gameState.inventory.products[
                    production.recipeId
                    ]
                ) {

                    gameState.inventory.products[
                        production.recipeId
                    ] = 0;

                }

                gameState.inventory.products[
                    production.recipeId
                ] += 1;

                addLog(
                    `Производство "${production.name}" успешно завершено!`
                );

                gameState.productionQueue.splice(i, 1);

            }

        }

        // =========================
        // ПРОДАЖИ
        // =========================

        let soldSomething = false;

        for (const productId in gameState.marketListings) {

            const listing =
                gameState.marketListings[productId];

            if (!listing.enabled) continue;

            const amount =
                gameState.inventory.products[productId] || 0;

            if (amount <= 0) continue;

            soldSomething = true;

            const sellInfo =
                sellData[productId];

            const recipe =
                recipes[productId];

            const recPrice =
                sellInfo.costPrice *
                (1 + recipe.time);

            let successChance = 100;

            // Цена выше рекомендуемой
            if (listing.price > recPrice) {

                const extraPercent =
                    (
                        (listing.price - recPrice)
                        / recPrice
                    ) * 100;

                const penaltySteps =
                    Math.floor(extraPercent / 10);

                successChance -= penaltySteps * 25;

                // Бонус за высокий %
                if (listing.dealerPercent >= 40) {
                    successChance += 15;
                }

            }

            // Ограничения
            if (successChance > 100) {
                successChance = 100;
            }

            if (successChance < 5) {
                successChance = 5;
            }

            // Забастовка барыг
            if (listing.dealerPercent < 15) {

                const strikeRoll =
                    Math.random();

                if (strikeRoll <= 0.3) {

                    addLog(
                        `Барыги отказались работать с товаром "${sellInfo.name}" за такой низкий процент!`
                    );

                    continue;

                }

            }

            // Проверка продажи
            const roll =
                Math.random() * 100;

            if (roll <= successChance) {

                const finalIncome =
                    Math.round(
                        amount *
                        listing.price *
                        (1 - listing.dealerPercent / 100)
                    );

                gameState.money += finalIncome;

                gameState.inventory.products[
                    productId
                ] = 0;

                addLog(
                    `Продан товар "${sellInfo.name}". Получено: $${finalIncome}.`
                );

            } else {

                addLog(
                    `Товар "${sellInfo.name}" не удалось реализовать.`
                );

            }

        }

        // =========================
        // РОЗЫСК
        // =========================

        if (soldSomething) {

            gameState.wantedLevel += 1;

            if (gameState.wantedLevel > 5) {
                gameState.wantedLevel = 5;
            }

            gameState.noSellDays = 0;

        } else {

            gameState.noSellDays += 1;

            if (
                gameState.noSellDays >= 3 &&
                gameState.wantedLevel > 0
            ) {

                gameState.wantedLevel -= 1;
                gameState.noSellDays = 0;

                addLog(
                    "Интерес полиции к вам снизился."
                );

            }

        }

        // =========================
        // ИСТОЩЕНИЕ
        // =========================

        if (gameState.energy <= 0) {

            addLog(
                "Вы потеряли сознание от истощения. Потрачено 3 дополнительных дня."
            );

            gameState.energy = 50;
            gameState.daysLeft -= 3;

        }

        // =========================
        // КОНЕЦ ИГРЫ
        // =========================

        if (gameState.daysLeft <= 0) {

            if (gameState.money >= gameState.targetGoal) {

                alert("ПОБЕДА");

            } else {

                alert("ПОРАЖЕНИЕ");

            }

        }

        localStorage.setItem(
            "badtrip_save",
            JSON.stringify(gameState)
        );

        updateUI();

        // =========================
        // POLICE RAID
        // =========================

        const raidChances = {

            0: 0,
            1: 0,
            2: 10,
            3: 30,
            4: 60,
            5: 95

        };

        const raidChance =
            raidChances[gameState.wantedLevel] || 0;

        const raidRoll =
            Math.random() * 100;

        if (raidRoll <= raidChance) {

            addLog(
                "ПОЛИЦИЯ ВЫШЛА НА ВАШ СЛЕД!"
            );

            triggerRaid();

        } else {

            // =========================
            // RANDOM EVENTS
            // =========================

            if (soldSomething) {

                const randomRoll =
                    Math.random();

                if (randomRoll <= 0.4) {

                    triggerRandomEvent();

                }

            }

        }

        // =========================
        // EFFECT TIMERS
        // =========================

        if (globalEffects.inflationDays > 0) {
            globalEffects.inflationDays--;
        }

        if (globalEffects.competitorDays > 0) {
            globalEffects.competitorDays--;
        }

        if (globalEffects.recommendationDays > 0) {
            globalEffects.recommendationDays--;
        }

    });

}

// Кнопка завершения дня
const nextDayBtn = document.getElementById("nextDayBtn");

if (nextDayBtn) {

    nextDayBtn.addEventListener("click", nextDay);

}

// Автозагрузка
if (window.location.pathname.includes("main.html")) {
    loadGame();
}

// =========================
// DAY TRANSITION
// =========================

function playDayTransition(callback) {

    const transition =
        document.getElementById("dayTransition");

    if (!transition) {

        callback();
        return;

    }

    transition.classList.add("active");

    setTimeout(() => {

        // Возврат вверх страницы
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Переключение на магазин
        document.querySelectorAll(".tab-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".tab-content")
            .forEach(tab => tab.classList.remove("active"));

        document.querySelector('[data-tab="shopTab"]')
            .classList.add("active");

        document.getElementById("shopTab")
            .classList.add("active");

        callback();

        setTimeout(() => {

            transition.classList.remove("active");

        }, 300);

    }, 500);

}

// =========================
// RAID SYSTEM
// =========================

let pendingRaid = false;

function triggerRaid() {

    pendingRaid = true;

    const modal =
        document.getElementById("raidModal");

    modal.classList.remove("hidden");

    // Блокировка вкладок
    document.querySelectorAll(".tab-btn")
        .forEach(btn => {

            btn.disabled = true;

        });

}

function closeRaidModal() {

    pendingRaid = false;

    const modal =
        document.getElementById("raidModal");

    modal.classList.add("hidden");

    document.querySelectorAll(".tab-btn")
        .forEach(btn => {

            btn.disabled = false;

        });

}

function payBribe() {

    const bribe =
        Math.floor(gameState.money * 0.5);

    gameState.money -= bribe;

    gameState.wantedLevel = 0;

    addLog(
        `Вы дали взятку полиции: -$${bribe}.`
    );

    closeRaidModal();

    updateUI();

}

function tryEscape() {

    const success =
        Math.random() <= 0.5;

    if (success) {

        gameState.daysLeft -= 5;

        addLog(
            "Вы смогли скрыться и залегли на дно."
        );

        closeRaidModal();

        updateUI();

    } else {

        alert("ВАС АРЕСТОВАЛИ. GAME OVER.");

        localStorage.removeItem("badtrip_save");

        window.location.href = "index.html";

    }

}

// =========================
// RANDOM EVENTS
// =========================

function triggerRandomEvent() {

    const events = [

        "inflation",
        "competitors",
        "dealer_scam",
        "recommendation"

    ];

    const randomEvent =
        events[
        Math.floor(Math.random() * events.length)
        ];

    switch (randomEvent) {

        case "inflation":

            globalEffects.inflationDays = 3;

            addLog(
                "ИНФЛЯЦИЯ: цены на ресурсы выросли на 20%."
            );

            break;

        case "competitors":

            globalEffects.competitorDays = 3;

            addLog(
                "КОНКУРЕНТЫ: рынок перенасыщен."
            );

            break;

        case "dealer_scam":

            for (const productId in gameState.marketListings) {

                const listing =
                    gameState.marketListings[productId];

                if (!listing.enabled) continue;

                const amount =
                    gameState.inventory.products[productId] || 0;

                const stolen =
                    Math.floor(amount / 2);

                gameState.inventory.products[productId] -= stolen;

            }

            addLog(
                "КИДОК БАРЫГ: часть товара была украдена."
            );

            break;

        case "recommendation":

            globalEffects.recommendationDays = 3;

            addLog(
                "РЕКОМЕНДАЦИЯ: спрос на ваш товар вырос."
            );

            break;

    }

}