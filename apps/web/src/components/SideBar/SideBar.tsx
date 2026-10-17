import styles from './SideBar.module.css';

const SideBar = () => {
    return (
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
    )
}

export default SideBar;