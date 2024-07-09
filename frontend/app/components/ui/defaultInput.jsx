import styles from "../styles/DefaultInput.module.css"
export default function DefaultInput({title, type, onChange}) {
    return <div className={styles.input_box}>
        <p className={styles.input_title}>{title}</p>
        <input onChange={onChange} className={styles.input} type={type} />
    </div>
}