import styles from "../styles/PurpleButton.module.css"
export default function PurpleButton({title, type, onClick}) {
    return <button className={styles.purple_button} onClick={onClick} type={type}>{title}</button>
}