import styles from './MainPage.module.css';
import { useEffect, useState } from 'react';
import type { IDashboardSummary } from '@cryptoleap_crm/shared';
import { getDashboardSummaryRequest } from '../../api/dashboard.api';
import { sendHeartbeatRequest } from '../../api/presence.api';

type DashboardCard = {
    id: number;
    title: string;
    value: string | number;
    description: string;
    type?: 'default' | 'success' | 'warning' | 'danger';
};

const createDashboardCards = (summary: IDashboardSummary | null): DashboardCard[] => [
    {
        id: 1,
        title: 'Пользователи онлайн',
        value: summary?.usersOnline ?? '—',
        description: 'Сейчас в системе',
        type: 'success',
    },
    {
        id: 2,
        title: 'Всего пользователей',
        value: summary?.usersTotal ?? '—',
        description: 'Зарегистрировано',
    },
    {
        id: 3,
        title: 'Активные задачи',
        value: summary?.tasksActive ?? '—',
        description: 'На данный момент',
        type: 'warning',
    },
    {
        id: 4,
        title: 'Завершённые задачи',
        value: summary?.tasksCompleted ?? '—',
        description: 'За всё время',
        type: 'success',
    },
    {
        id: 5,
        title: 'Просроченные задачи',
        value: summary?.tasksOverdue ?? '—',
        description: 'Требуют внимания',
        type: 'danger',
    },
    {
        id: 6,
        title: 'Создано сегодня',
        value: summary?.tasksCreatedToday ?? '—',
        description: 'Новых задач',
    },
];

const MainPage = () => {
    const [summary, setSummary] = useState<IDashboardSummary| null>(null);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
    const dashboardCards = createDashboardCards(summary);

    const loadDashboard = async () => {
        try {
            const data = await getDashboardSummaryRequest();

            setSummary(data);
            setDashboardError(null);
        } catch {
            setDashboardError("Не удалось загрузить данные дашборда");
        }
    };

    useEffect(() => {
        const updatePresence = async () => {
            try {
                await sendHeartbeatRequest();
                await loadDashboard();
            } catch {
                return;
            }
        }

        updatePresence();

        const interval = window.setInterval(updatePresence, 30_000);

        return () => {
            window.clearInterval(interval)
        };
    }, []);

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
                        
                        {dashboardError && (
                            <p>{dashboardError}</p>
                        )}
                        
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