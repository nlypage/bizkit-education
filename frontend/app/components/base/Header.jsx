import styles from "../styles/Header.module.css"
import LogoWithTitle from "../ui/LogoWithTitle"

export default function Header() {
    return <div className={styles.header}>
        <LogoWithTitle></LogoWithTitle>
    </div>
}