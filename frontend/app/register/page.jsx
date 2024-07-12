'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../components/base/Header";
import styles from "../components/styles/SignupForm.module.css"
import OpacitedButton from "../components/ui/opacitedButton"
import PurpleButton from "../components/ui/purpleButton"
import stylesForInput from "../components/styles/DefaultInput.module.css"
import Title from '../components/base/Title';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailError('');
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPasswordError('');
    setPassword(e.target.value);
  };
  
  const handleConfirmPasswordChange = (e) => {
    setPasswordError('');
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Введите действительный адрес электронной почты');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    const response = await fetch('https://bizkit.fun/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });
    const data = await response.json();
    if (response.ok) {
      router.push('/login');
      console.log('all okay')
    } else {
      // Handle registration error
      console.error(data.error);
      Toastify({
        text: 'Ошибка, попробуйте другую почту',
        duration: 3000,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#7950F2",
          width: '100%'
        },
        onClick: function() {}
      }).showToast();
    }
  };

  return (
    <main>
      <Header></Header>
      <form onSubmit={handleSubmit}>
        <div className={styles.login_form}>
          <div className={styles.welcome_message_box}>
            <Title/>
            <p className={styles.welcome_message}>Вход в <span className={styles.welcome_message_title}>BIZKIT</span></p>
          </div>

          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Электронная почта</p>
            <input value={email} onChange={handleEmailChange} className={stylesForInput.input} type="text" />
            {emailError && <div className={styles.error_message}>{emailError}</div>}
          </div>

          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Юзернейм</p>
            <input value={username} onChange={handleUsernameChange} className={stylesForInput.input} type="text" />
          </div>

          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Пароль</p>
            <input value={password} onChange={handlePasswordChange} className={stylesForInput.input} type="password" />
            {passwordError && <div className={styles.error_message}>{passwordError}</div>}
          </div>

          <div className={stylesForInput.input_box}>
            <p className={stylesForInput.input_title}>Повторите пароль</p>
            <input value={confirmPassword} onChange={handleConfirmPasswordChange} className={stylesForInput.input} type="password" />
            {passwordError && <div className={styles.error_message}>{passwordError}</div>}
          </div>

          <div className={styles.button_box}>
              <PurpleButton title={"Зарегестрироваться"} type={"submit"}></PurpleButton>
          </div>

          <div className={styles.button_box}>
              <OpacitedButton title={"Вход"} onClick={() => {
                window.location.href = "/login"
              }}></OpacitedButton>
          </div>
        </div>
      </form>
    </main>
  );
}