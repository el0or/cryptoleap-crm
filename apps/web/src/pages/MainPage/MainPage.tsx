import styles from './MainPage.module.css';

type DashboardCard = {
    id: number;
    title: string;
    value: string | number;
    description: string;
    type?: 'default' | 'success' | 'warning' | 'danger';
};

const dashboardCards: DashboardCard[] = [
    {
        id: 1,
        title: 'Пользователи онлайн',
        value: 18,
        description: 'Сейчас в системе',
        type: 'success',
    },
    {
        id: 2,
        title: 'Всего пользователей',
        value: 124,
        description: 'Зарегистрировано',
    },
    {
        id: 3,
        title: 'Активные задачи',
        value: 37,
        description: 'На данный момент',
        type: 'warning',
    },
    {
        id: 4,
        title: 'Завершённые задачи',
        value: 286,
        description: 'За всё время',
        type: 'success',
    },
    {
        id: 5,
        title: 'Просроченные задачи',
        value: 6,
        description: 'Требуют внимания',
        type: 'danger',
    },
    {
        id: 6,
        title: 'Создано сегодня',
        value: 14,
        description: 'Новых задач',
    },
];

const MainPage = () => {
    const handleAddWidget = () => {
        // Потом здесь можно открыть modal
        // с выбором доступных виджетов.
        console.log('Открыть меню добавления виджетов');
    };

    return (
        <div className={styles.mainSection}>
            <div className={styles.sideBar}>
                <div className={styles.sideBarContainer}>
                    <div className={styles.sideBarLogo}>
                        CryptoLeap
                    </div>

                    <div className={styles.sideBarContent}>
                        <h3>Основные</h3>

                        <ul>
                            <li>
                                <a href="/main">Главная</a>
                            </li>

                            <li>
                                <a href="/tasks">Задачи</a>
                            </li>

                            <li>
                                <a href="/calendar">Календарь</a>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.sideBarContent}>
                        <h3>Профиль</h3>

                        <ul>
                            <li>
                                <a href="/profile">Профиль</a>
                            </li>

                            <li>
                                <a href="/settings">Настройки</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.sideBarExit}>
                    <a href="/logout">Выйти</a>
                </div>
            </div>

            <main className={styles.mainContent}>
                <div className={styles.mainContentHeader}>
                    <form
                        className={styles.mainContentSearch}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <input
                            type="text"
                            placeholder="Поиск..."
                        />
                    </form>

                    <div className={styles.mainContentHeadGroup}>
                        <button
                            type="button"
                            className={styles.headerButton}
                            aria-label="Уведомления"
                        >
                            🔔
                        </button>

                        <button
                            type="button"
                            className={styles.headerButton}
                            aria-label="Настройки"
                        >
                            ⚙
                        </button>
                    </div>
                </div>

                <div className={styles.mainContentBody}>
                    <div className={styles.dashboardHeading}>
                        <div>
                            <h1>Главная</h1>
                            <p>
                                Основные показатели CryptoLeap
                            </p>
                        </div>

                        <button
                            type="button"
                            className={styles.addWidgetButton}
                            onClick={handleAddWidget}
                        >
                            <span>+</span>
                            Добавить виджет
                        </button>
                    </div>

                    <section className={styles.dashboardGrid}>
                        {dashboardCards.map((card) => (
                            <article
                                key={card.id}
                                className={`${styles.dashboardCard} ${
                                    card.type
                                        ? styles[card.type]
                                        : ''
                                }`}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardTitle}>
                                        {card.title}
                                    </span>

                                    <button
                                        type="button"
                                        className={styles.cardMenu}
                                        aria-label="Настройки виджета"
                                    >
                                        •••
                                    </button>
                                </div>

                                <strong className={styles.cardValue}>
                                    {card.value}
                                </strong>

                                <span className={styles.cardDescription}>
                                    {card.description}
                                </span>

                                <div className={styles.fakeChart}>
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </article>
                        ))}

                        <button
                            type="button"
                            className={styles.emptyWidget}
                            onClick={handleAddWidget}
                        >
                            <span className={styles.emptyWidgetIcon}>
                                +
                            </span>

                            <span>Добавить плитку</span>
                        </button>
                    </section>

                    <section className={styles.dashboardBottomGrid}>
                        <article className={styles.largeWidget}>
                            <div className={styles.widgetHeader}>
                                <div>
                                    <h2>Активность задач</h2>
                                    <p>Последние 7 дней</p>
                                </div>

                                <select defaultValue="7">
                                    <option value="7">7 дней</option>
                                    <option value="30">30 дней</option>
                                    <option value="90">90 дней</option>
                                </select>
                            </div>

                            <div className={styles.chartPlaceholder}>
                                <div
                                    className={
                                        styles.chartPlaceholderLine
                                    }
                                />

                                <span>
                                    Здесь позже будет график
                                </span>
                            </div>
                        </article>

                        <article className={styles.activityWidget}>
                            <div className={styles.widgetHeader}>
                                <div>
                                    <h2>Последняя активность</h2>
                                    <p>Действия пользователей</p>
                                </div>

                                <button type="button">
                                    Все
                                </button>
                            </div>

                            <div className={styles.activityList}>
                                <div className={styles.activityItem}>
                                    <div
                                        className={
                                            styles.activityAvatar
                                        }
                                    >
                                        AK
                                    </div>

                                    <div>
                                        <strong>
                                            Александр
                                        </strong>

                                        <p>
                                            Закрыл задачу #128
                                        </p>
                                    </div>

                                    <time>5 мин</time>
                                </div>

                                <div className={styles.activityItem}>
                                    <div
                                        className={
                                            styles.activityAvatar
                                        }
                                    >
                                        MS
                                    </div>

                                    <div>
                                        <strong>
                                            Мария
                                        </strong>

                                        <p>
                                            Создала новую задачу
                                        </p>
                                    </div>

                                    <time>18 мин</time>
                                </div>

                                <div className={styles.activityItem}>
                                    <div
                                        className={
                                            styles.activityAvatar
                                        }
                                    >
                                        IV
                                    </div>

                                    <div>
                                        <strong>
                                            Иван
                                        </strong>

                                        <p>
                                            Изменил статус проекта
                                        </p>
                                    </div>

                                    <time>42 мин</time>
                                </div>
                            </div>
                        </article>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MainPage;