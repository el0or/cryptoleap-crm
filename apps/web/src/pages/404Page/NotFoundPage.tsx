import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.notFoundPage}>
            <div className={styles.container}>
                <h1>404</h1>
                <p onClick={() => window.location.href = '/main'} className={styles.link}>
                    Page not found
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;