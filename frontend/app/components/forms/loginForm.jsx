import styles from "../styles/LoginForm.module.css"
import DefaultInput from "../ui/DefaultInput"
import LogoWithTitle from "../ui/LogoWithTitle"
import OpacitedButton from "../ui/OpacitedButton"
import PurpleButton from "../ui/PurpleButton"

export default function LoginForm() {
    return <div className={styles.login_form}>
        <div className={styles.welcome_message_box}>
            <LogoWithTitle></LogoWithTitle>
            <p className={styles.welcome_message}>Вход в <span className={styles.welcome_message_title}>Biscuit</span></p>
        </div>
        <DefaultInput type={"text"} title={"Электронная почта"}></DefaultInput>
        <DefaultInput type={"password"} title={"Пароль"}></DefaultInput>

        <div className={styles.button_box}>
            <PurpleButton title={"Войти"}></PurpleButton>
        </div>

        <div className={styles.button_box}>
            <OpacitedButton title={"Создать аккаунт"}></OpacitedButton>
        </div>
        
    </div>
}