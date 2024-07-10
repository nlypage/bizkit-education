import styles from "../styles/LogoWithTitle.module.css"

export default function Title() {
    return <div className={styles.logobox}>
        <img className={styles.logobox_logo} src="biscuit.png" alt=""/>
        <h1 className={styles.logobox_title}>BIZKIT</h1>
    </div>
}