import styles from "../styles/Header.module.css"
import Title from "./Title"

export default function Header() {
    return <div className={styles.header}>
        <Title/>
    </div>
}