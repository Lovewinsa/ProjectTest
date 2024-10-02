import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// WebSocket 서버와 연결 설정
const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // WebSocket 연결
  useEffect(() => {
    const socket = new SockJS('httP://localhost:8888/api/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  return { stompClient, messages, setMessages, notifications, setNotifications };
};

export default useWebSocket;
