import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

// WebSocket 서버와 연결 설정
const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // WebSocket 연결
  useEffect(() => {
    const socket = new SockJS('httP://localhost:8888/api/ws');
    // Stomp 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결 지연 시간 (5초)
      debug: () => {},      // 디버그 로그 비활성화
    });

    client.onConnect = () => {
      setStompClient(client);
    };  

    client.onStompError = (error) => {
      console.error('STOMP Error: ', error);
    };

    client.activate(); // 클라이언트 활성화 및 연결 시도

    return () => {
      if (client) {
        client.deactivate(); // 컴포넌트 unmount 시 WebSocket 연결 해제
      }
    };
  }, []);

  return { stompClient, messages, setMessages, notifications, setNotifications };
};

export default useWebSocket;
