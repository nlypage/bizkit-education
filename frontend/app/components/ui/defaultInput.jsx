import styles from "../styles/DefaultInput.module.css"
export default function DefaultInput({title, type, onChange, name, value}) {
    return <div className={styles.input_box}>
        <p className={styles.input_title}>{title}</p>
        <input onChange={onChange} value={value} required className={styles.input} name={name} type={type} />
    </div>
}