import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// WebSocket 서버와 연결 설정
const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 추가

  // WebSocket 연결
  useEffect(() => {
    const socket = new SockJS("http://localhost:8888/api/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      setStompClient(client);
      setIsConnected(true); // 연결 상태 업데이트
    };

    client.onStompError = (error) => {
      console.error("STOMP Error: ", error);
    };

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
        setIsConnected(false); // 연결 해제 시 상태 업데이트
      }
    };
  }, []);

  return {
    stompClient,
    messages,
    setMessages,
    notifications,
    setNotifications,
    isConnected,
  };
};

export default useWebSocket;
