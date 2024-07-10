"use client";
import styles from "../components/styles/LoginForm.module.css"
import LogoWithTitle from "../components/ui/LogoWithTitle"
import OpacitedButton from "../components/ui/OpacitedButton"
import PurpleButton from "../components/ui/PurpleButton"
import stylesForInput from "../components/styles/DefaultInput.module.css"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/base/Header";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://bizkit.fun/api/v1/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(JSON.stringify({ username, password }));
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("authToken", data.body);
      console.log(data.body);
      router.push("/");
    } else {
      console.error(data.error);
    }
  };

  return (
    
    <main>
      <Header></Header>
      <form onSubmit={handleSubmit}>
        <div className={styles.login_form}>
          <div className={styles.welcome_message_box}>
              <LogoWithTitle></LogoWithTitle>
              <p className={styles.welcome_message}>Вход в <span className={styles.welcome_message_title}>BIZKIT</span></p>
          </div>

          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Юзернейм</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className={stylesForInput.input} type="text" />
          </div>
          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Пароль</p>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className={stylesForInput.input} type="password" />
          </div>

          <div className={styles.button_box}>
              <PurpleButton title={"Войти"} type={"submit"}></PurpleButton>
          </div>

          <div className={styles.button_box}>
            <OpacitedButton title={"Создать аккаунт"} onClick={() => {
              window.location.href = "/register"
            }}></OpacitedButton>
          </div>
        </div>
      </form>
    </main>
  );
}
