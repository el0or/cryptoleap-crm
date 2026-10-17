import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import styles from './AppLayout.module.css';

const AppLayout = () => {
    return (
        <div className={styles.mainSection}>
            <SideBar />

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout;