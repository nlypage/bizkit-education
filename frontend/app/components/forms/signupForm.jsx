import Title from "../base/Title"
import styles from "../styles/SignupForm.module.css"
import DefaultInput from "../ui/DefaultInput"
import OpacitedButton from "../ui/opacitedButton"
import PurpleButton from "../ui/purpleButton"

export default function SignupForm() {
    return <div className={styles.login_form}>
        <div className={styles.welcome_message_box}>
            <Title/>
            <p className={styles.welcome_message}>Вход в <span className={styles.welcome_message_title}>Biscuit</span></p>
        </div>
        <DefaultInput type={"text"} title={"Электронная почта"}></DefaultInput>
        <DefaultInput type={"text"} title={"Никнейм"}></DefaultInput>
        <DefaultInput type={"text"} title={"Пароль"}></DefaultInput>
        <DefaultInput type={"password"} title={"Повторите пароль"}></DefaultInput>


        <div className={styles.button_box}>
            <PurpleButton title={"Зарегестрироваться"}></PurpleButton>
        </div>

        <div className={styles.button_box}>
            <OpacitedButton title={"Вход"}></OpacitedButton>
        </div>
        
    </div>
}