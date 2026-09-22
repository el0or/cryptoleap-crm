import styles from './MainPage.module.css';
import { useEffect, useState } from 'react';
import { DASHBOARD_WIDGET_TYPES , type DashboardWidgetType, type IDashboardSummary, type IDashboardLayout } from '@cryptoleap_crm/shared';
import { getDashboardSummaryRequest, getDashboardLayoutRequest, updateDashboardLayoutRequest } from '../../api/dashboard.api';
import { sendHeartbeatRequest } from '../../api/presence.api';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type DashboardCard = {
    id: DashboardWidgetType;
    title: string;
    value: string | number;
    description: string;
    type?: 'default' | 'success' | 'warning' | 'danger';
};

const createDashboardCardRegistry = (summary: IDashboardSummary | null): Record<DashboardWidgetType, DashboardCard> => ({
    USERS_ONLINE: {
        id: 'USERS_ONLINE',
        title: 'Пользователи онлайн',
        value: summary?.usersOnline ?? '—',
        description: 'Сейчас в системе',
        type: 'success',
    },
    USERS_TOTAL: {
        id: 'USERS_TOTAL',
        title: 'Всего пользователей',
        value: summary?.usersTotal ?? '—',
        description: 'Зарегистрировано',
    },
    TASKS_ACTIVE: {
        id: 'TASKS_ACTIVE',
        title: 'Активные задачи',
        value: summary?.tasksActive ?? '—',
        description: 'На данный момент',
        type: 'warning',
    },
    TASKS_COMPLETED: {
        id: 'TASKS_COMPLETED',
        title: 'Завершённые задачи',
        value: summary?.tasksCompleted ?? '—',
        description: 'За всё время',
        type: 'success',
    },
    TASKS_OVERDUE: {
        id: 'TASKS_OVERDUE',
        title: 'Просроченные задачи',
        value: summary?.tasksOverdue ?? '—',
        description: 'Требуют внимания',
        type: 'danger',
    },
    TASKS_CREATED_TODAY: {
        id: 'TASKS_CREATED_TODAY',
        title: 'Создано сегодня',
        value: summary?.tasksCreatedToday ?? '—',
        description: 'Новых задач',
    },
});

// drag-and-drop

type SortableDashboardCardProps = {
    card: DashboardCard;
    openedCardMenu: DashboardWidgetType | null;
    setOpenedCardMenu: (widget: DashboardWidgetType | null) => void;
    onRemove: (widget: DashboardWidgetType) => void;
};

const SortableDashboardCard = ({
    card,
    openedCardMenu,
    setOpenedCardMenu,
    onRemove,
    }: SortableDashboardCardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <article 
        ref={setNodeRef}
        style={style}
        className={`${styles.dashboardCard} ${card.type ? styles[card.type] : ''}`}
        {...attributes}
        >
             <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{card.title}</span>

                <div className={styles.cardActions}>
                <button
                    type="button"
                    className={styles.dragHandle}
                    aria-label="Переместить виджет"
                    {...listeners}
                >
                    ⋮⋮
                </button>

                <div className={styles.cardMenuWrapper}>
                    <button
                    type="button"
                    className={styles.cardMenu}
                    aria-label="Настройки виджета"
                    onClick={() => setOpenedCardMenu(openedCardMenu === card.id ? null : card.id)}
                    >
                    •••
                    </button>

                    {openedCardMenu === card.id && (
                    <div className={styles.cardMenuDropdown}>
                        <button type="button" onClick={() => onRemove(card.id)}>
                        Удалить с главной
                        </button>
                    </div>
                    )}
                </div>
                </div>
            </div>

            <strong className={styles.cardValue}>{card.value}</strong>

            <span className={styles.cardDescription}>{card.description}</span>

            <div className={styles.fakeChart}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>
        </article>
    );
};


const MainPage = () => {
    const [summary, setSummary] = useState<IDashboardSummary | null>(null);
    const [layout, setLayout] = useState<IDashboardLayout | null>(null);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
    const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
    const [openedCardMenu, setOpenedCardMenu] = useState<DashboardWidgetType | null>(null);
    const cardRegistry = createDashboardCardRegistry(summary);
    const dashboardCards = layout?.widgets.map(widgetType => cardRegistry[widgetType]) ?? [];

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
        const initializeDashboard = async () => {
            try {
                await sendHeartbeatRequest();

                const [summaryData, layoutData] = await Promise.all([
                    getDashboardSummaryRequest(),
                    getDashboardLayoutRequest(),
                ]);

                setSummary(summaryData);
                setLayout(layoutData);
                setDashboardError(null);
            } catch {
                setDashboardError("Не удалось загрузить данные дашборда");
            }
        }

        const updatePresence = async () => {
            try {
                await sendHeartbeatRequest();
                const summaryData = await getDashboardSummaryRequest();
                setSummary(summaryData);
            } catch {
                return;
            }
        }

        initializeDashboard();

        const interval = window.setInterval(updatePresence, 30_000);

        return () => {
            window.clearInterval(interval)
        };
    }, []);

    const handleAddWidget = async (widget: DashboardWidgetType) => {
        if (!layout || layout.widgets.includes(widget)) {
            return;
        }

        const widgets = [...layout.widgets, widget];

        try {
            const updatedLayout = await updateDashboardLayoutRequest(widgets);

            setLayout(updatedLayout);
            setDashboardError(null);
        } catch {
            setDashboardError('Не удалось добавить виджет');
        }
    };

    const handleRemoveWidget = async (widget: DashboardWidgetType) => {
        if (!layout) {
            return;
        }

        const widgets = layout.widgets.filter((item) => item !== widget);

        try {
            const updatedLayout = await updateDashboardLayoutRequest(widgets);

            setLayout(updatedLayout);
            setOpenedCardMenu(null);
        } catch {
            setDashboardError('Не удалось удалить виджет');
        }
    };

    const availableWidgets = Object.values(DASHBOARD_WIDGET_TYPES).filter((widget => {
        return !layout?.widgets.includes(widget);
    }));

    const handleDragEnd = async (event: DragEndEvent) => {
        if (!layout) return;

        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = layout.widgets.indexOf(active.id as DashboardWidgetType);
        const newIndex = layout.widgets.indexOf(over.id as DashboardWidgetType);

        if (oldIndex === -1 || newIndex === -1) return;

        const newWidgets = arrayMove(layout.widgets, oldIndex, newIndex);

        setLayout({ ...layout, widgets: newWidgets });

        try {
            const updatedLayout = await updateDashboardLayoutRequest(newWidgets);
            setLayout(updatedLayout);
            setDashboardError(null);
        } catch {
            setLayout(layout); // revert to previous layout on error
            setDashboardError('Не удалось обновить порядок виджетов');
        }
    }

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
                            onClick={() => setIsWidgetModalOpen(true)}
                        >
                            <span>+</span>
                            Добавить виджет
                        </button>
                    </div>

                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={layout?.widgets ?? []} strategy={rectSortingStrategy}>
                            <section className={styles.dashboardGrid}>
                            {dashboardCards.map((card) => (
                                <SortableDashboardCard
                                key={card.id}
                                card={card}
                                openedCardMenu={openedCardMenu}
                                setOpenedCardMenu={setOpenedCardMenu}
                                onRemove={handleRemoveWidget}
                                />
                            ))}

                            <button
                                type="button"
                                className={styles.emptyWidget}
                                onClick={() => setIsWidgetModalOpen(true)}
                            >
                                <span className={styles.emptyWidgetIcon}>+</span>
                                <span>Добавить плитку</span>
                            </button>
                            </section>
                        </SortableContext>
                    </DndContext>

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
            {isWidgetModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsWidgetModalOpen(false)}>
                    <div className={styles.widgetModal} onClick={(event) => event.stopPropagation()}>
                    <div className={styles.widgetModalHeader}>
                        <div>
                        <h2>Добавить виджет</h2>
                        <p>Выберите карточку для главной страницы</p>
                        </div>

                        <button type="button" onClick={() => setIsWidgetModalOpen(false)}>
                        ×
                        </button>
                    </div>

                    <div className={styles.widgetModalList}>
                        {availableWidgets.length > 0 ? (
                        availableWidgets.map((widget) => {
                            const card = cardRegistry[widget];

                            return (
                            <button
                                key={widget}
                                type="button"
                                className={styles.widgetModalItem}
                                onClick={() => handleAddWidget(widget)}
                            >
                                <div>
                                <strong>{card.title}</strong>
                                <span>{card.description}</span>
                                </div>

                                <span>+</span>
                            </button>
                            );
                        })
                        ) : (
                        <p className={styles.widgetModalEmpty}>Все доступные виджеты уже добавлены</p>
                        )}
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;