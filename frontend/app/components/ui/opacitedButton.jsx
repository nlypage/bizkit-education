import styles from "../styles/OpacitedButton.module.css"
export default function OpacitedButton({title, type, onClick, className}) {
    return <button className={`${styles.opacited_button} ${className}`} onClick={onClick} type={type}>{title}</button>
}