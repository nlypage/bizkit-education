"use client";

import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function Stream({ params }) {
  const router = useRouter();
  const roomID = params.roomID;
  let role_str = getUrlParams(window.location.href).get("role") || "Host";
  const role =
    role_str === "Host"
      ? ZegoUIKitPrebuilt.Host
      : role_str === "Cohost"
      ? ZegoUIKitPrebuilt.Cohost
      : ZegoUIKitPrebuilt.Audience;

  let sharedLinks = [];
  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.push({
      name: "Ссылка для администратора",
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "/room/" +
        roomID +
        "?roomID=" +
        roomID +
        "&role=Cohost",
    });
  }
  sharedLinks.push({
    name: "Ссылка для пользователя",
    url:
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "/room/" +
      roomID +
      "?roomID=" +
      roomID +
      "&role=Audience",
  });
  const appID = +process.env.NEXT_PUBLIC_APP_ID;
  const serverSecret = process.env.NEXT_PUBLIC_APP_SECRET;
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    randomID(5),
    randomID(5)
  );

  let conference = async (element) => {
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      sharedLinks,
    });
  };

  

  return (
    <div>
      <div
        className="myCallContainer"
        ref={conference}
        style={{ width: "100vw", height: "50vh" }}
      ></div>
    </div>
  );
}
