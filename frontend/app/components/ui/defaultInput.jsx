import styles from "../styles/DefaultInput.module.css"
export default function DefaultInput({title, type, onChange, name}) {
    return <div className={styles.input_box}>
        <p className={styles.input_title}>{title}</p>
        <input onChange={onChange} required className={styles.input} name={name} type={type} />
    </div>
}