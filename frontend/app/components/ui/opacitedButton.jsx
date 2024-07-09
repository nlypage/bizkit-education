import styles from "../styles/OpacitedButton.module.css"
export default function OpacitedButton({title, type, onClick}) {
    return <button className={styles.opacited_button} onClick={onClick} type={type}>{title}</button>
}