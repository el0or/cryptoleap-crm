import { useEffect, useState } from 'react';
import { TASK_PRIORITIES, TASK_STATUSES, type ICreateTaskRequest, type ITask, type TaskPriority, type TaskStatus } from '@cryptoleap_crm/shared';
import { createTaskRequest, getTasksRequest, updateTaskStatusRequest } from '../../api/tasks.api';
import styles from './TasksPage.module.css';
import type { IUser } from '@cryptoleap_crm/shared';
import { getUsersRequest } from '../../api/users.api';

const statusLabels: Record<TaskStatus, string> = {
    TODO: 'К выполнению',
    IN_PROGRESS: 'В работе',
    DONE: 'Завершена',
    CANCELED: 'Отменена',
};

const priorityLabels: Record<TaskPriority, string> = {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
    URGENT: 'Срочный',
};

const formatDate = (date: string | null) => {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
};

const TasksPage = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [dueAt, setDueAt] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [assigneeId, setAssigneeId] = useState('');

    useEffect(() => {
        const initializeTasks = async () => {
            try {
                const [tasksData, usersData] = await Promise.all([
                    getTasksRequest(),
                    getUsersRequest(),
                ]);

                setTasks(tasksData);
                setUsers(usersData);
                setError(null);
            } catch {
                setError('Не удалось загрузить данные страницы');
            } finally {
                setIsLoading(false);
            }
        };

        void initializeTasks();
    }, []);

    const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        const payload: ICreateTaskRequest = {
            title: title.trim(),
            priority,
        };

        if (description.trim()) {
            payload.description = description.trim();
        }

        if (dueAt) {
            payload.dueAt = new Date(dueAt).toISOString();
        }

        if (assigneeId) {
            payload.assigneeId = assigneeId;
        }

        try {
            setIsCreating(true);

            const task = await createTaskRequest(payload);

            setTasks((currentTasks) => [task, ...currentTasks]);
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            setDueAt('');
            setIsCreateOpen(false);
            setError(null);
            setAssigneeId('');
        } catch {
            setError('Не удалось создать задачу');
        } finally {
            setIsCreating(false);
        }
    };

    const handleStatusChange = async (taskId: string, status: TaskStatus) => {
        try {
            const updatedTask = await updateTaskStatusRequest(taskId, {
                status,
            });

            setTasks((currentTasks) => currentTasks.map((task) => (
                task.id === taskId
                    ? {
                        ...task,
                        ...updatedTask,
                    }
                    : task
            )));

            setError(null);
        } catch {
            setError('Не удалось изменить статус задачи');
        }
    };

    return (
        <div className={styles.mainSection}>
            <main className={styles.tasksPage}>
                <header className={styles.header}>
                    <div>
                        <h1>Задачи</h1>
                        <p>Управление задачами команды</p>
                    </div>

                    <button type="button" onClick={() => setIsCreateOpen(true)}>
                        + Создать задачу
                    </button>
                </header>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className={styles.state}>
                        Загрузка задач...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className={styles.state}>
                        Задач пока нет
                    </div>
                ) : (
                    <div className={styles.tasksTable}>
                        <div className={styles.tableHeader}>
                            <span>Задача</span>
                            <span>Статус</span>
                            <span>Приоритет</span>
                            <span>Исполнитель</span>
                            <span>Срок</span>
                        </div>

                        {tasks.map((task) => (
                            <div key={task.id} className={styles.taskRow}>
                                <div className={styles.taskInfo}>
                                    <strong>{task.title}</strong>

                                    {task.description && (
                                        <p>{task.description}</p>
                                    )}
                                </div>

                                <select
                                    value={task.status}
                                    onChange={(event) => handleStatusChange(task.id, event.target.value as TaskStatus)}
                                >
                                    {Object.values(TASK_STATUSES).map((status) => (
                                        <option key={status} value={status}>
                                            {statusLabels[status]}
                                        </option>
                                    ))}
                                </select>

                                <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                                    {priorityLabels[task.priority]}
                                </span>

                                <span>
                                    {task.assignee?.name || task.assignee?.email || 'Не назначен'}
                                </span>

                                <span>
                                    {formatDate(task.dueAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {isCreateOpen && (
                    <div className={styles.modalOverlay} onClick={() => setIsCreateOpen(false)}>
                        <form className={styles.modal} onSubmit={handleCreateTask} onClick={(event) => event.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>Новая задача</h2>
                                    <p>Создайте задачу для команды</p>
                                </div>

                                <button type="button" onClick={() => setIsCreateOpen(false)}>
                                    ×
                                </button>
                            </div>

                            <label>
                                Название
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    minLength={2}
                                    maxLength={200}
                                    required
                                    autoFocus
                                />
                            </label>

                            <label>
                                Описание
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    maxLength={5000}
                                />
                            </label>

                            <label>
                                Приоритет
                                <select
                                    value={priority}
                                    onChange={(event) => setPriority(event.target.value as TaskPriority)}
                                >
                                    {Object.values(TASK_PRIORITIES).map((taskPriority) => (
                                        <option key={taskPriority} value={taskPriority}>
                                            {priorityLabels[taskPriority]}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Исполнитель
                                <select
                                    value={assigneeId}
                                    onChange={(event) => setAssigneeId(event.target.value)}
                                >
                                    <option value="">Не назначен</option>

                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name || user.email}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Срок
                                <input
                                    type="datetime-local"
                                    value={dueAt}
                                    onChange={(event) => setDueAt(event.target.value)}
                                />
                            </label>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsCreateOpen(false)}>
                                    Отмена
                                </button>

                                <button type="submit" disabled={isCreating}>
                                    {isCreating ? 'Создание...' : 'Создать задачу'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TasksPage;