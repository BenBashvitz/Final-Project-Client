import styles from "./LoginHeader.module.css";

type LoginHeaderProps = {
    title: string;
    description: string;
}

export const LoginHeader = ({title, description}: LoginHeaderProps) => {
    return (
        <header className={styles.cardHeader}>
            <div className={styles.logoCircle}>IG</div>
            <h1 className={styles.cardTitle}>
                {title}
            </h1>
            <p className={styles.cardDescription}>
                {description}
            </p>
        </header>
    )
}