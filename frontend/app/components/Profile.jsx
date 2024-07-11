"use client";

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import styles from "./styles/Profile.module.css"

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth(
          `https://bizkit.fun/api/v1/user/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUser(data.body);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);
  console.log(user);


  

  return (
    <>
      <div className={styles.profile_box}>
        <div className={styles.profile_user_data_box}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YIGV8GTRHiW_KACLMhhi9fEq2T5BDQcEyA&s" className={styles.profile_avatar} alt="" />
          <div className={styles.profile_nickname_and_rank}>
            <p className={styles.profile_nickname}>{user?.username}</p>
            <div style={{display: "block"}}>
              <img src="https://img.icons8.com/?size=100&id=99885&format=png&color=7950F2" style={{marginLeft: "5px", marginTop: "5px"}} width={"15"} height={"15"} alt="" />
              <p className={styles.profile_rank}>{user?.rate}</p>
            </div>
          </div>
        </div>
        <hr className={styles.profile_hr} />
        
        <div className={styles.profile_cookies_count_box}>
          <img src="profile_kitten.png" alt="" className={styles.profile_kitten} />
          <div className={styles.profile_cookies_count}>
            <img src="biscuit.png" style={{
              width: "100px",
              height: "100px"
            }} alt="" />
            <hr style={{
              backgroundColor: "#7950F2", 
              border: "none",
              height: "95px",
              width: "1px",
              marginLeft: "5px"
            }} />
            <p style={{
              marginTop: "15px",
              marginLeft: "5px"

            }}>{user?.coins_amount}</p>
            
            
          </div>
        </div>

        
      </div>
      {/* <div>{user?.email}</div>
      <div>{user?.role}</div>
      <div>{user?.rate}</div>
      <div>{user?.username}</div>
      <div>{user?.coins_amount}</div> */}
      <br />
    <br />
    <br />
    <br />
    <br />
    </>
  );
};

export default Profile;
