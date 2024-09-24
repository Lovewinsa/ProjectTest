import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from "react-redux";

const ChatRoom = () => {
  const [chatRooms, setChatRooms] = useState([]);  // 채팅방 목록
  const [messages, setMessages] = useState([]);  // 메시지 목록
  const [newMessage, setNewMessage] = useState('');  // 새로운 메시지
  const stompClient = useRef(null);  // WebSocket 연결 객체
  const username = useSelector(state => state.userData.username, shallowEqual);  // 유저네임 불러오기
  const navigate = useNavigate();
  const { roomId } = useParams(); // URL에서 roomId 가져오기
  // const connectWebSocket = useRef(null);

  
  // 채팅방 목록을 불러오기 위한 useEffect
  useEffect(() => {
    axios.get('/api/chat/rooms')
      .then(response => {
        setChatRooms(response.data);

        // roomId가 있을 경우 해당 방으로 자동 이동
        if (roomId) {
          selectRoom(roomId);
        }
      })
      .catch(error => {
        console.error('Error fetching chat rooms', error);
      });
  }, [username, roomId]);

  // WebSocket 연결 함수
  const connectWebSocket = (roomId) => {
    const socket = new SockJS('/api/ws');  // SockJS 엔드포인트 경로
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,  // 재연결 시도 시간

      onConnect: () => {
        console.log(`Connected to WebSocket for room ${roomId}`);
        stompClient.current.subscribe(`/topic/room/${roomId}`, (messageOutput) => {
          const newMessage = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      
        // // 방에 사용자 추가 메시지 전송
        // stompClient.current.publish({
        //   destination: `/app/chat.addUser/${roomId}`,
        //   body: JSON.stringify({ sender: username, type: 'JOIN' })
        // });
      },

      onStompError: (error) => {
        console.error('STOMP error:', error);
      },

      onWebSocketClose: () => {
        console.log('WebSocket connection closed.');
        console.log("99")
      }
    });

    stompClient.current.activate();

  };

  // 채팅방 선택 시 WebSocket 연결 및 메시지 불러오기
  const selectRoom = (roomId) => {
    console.log("11")
    navigate(`/chatroom/${roomId}`);  // 페이지 이동
    axios.get(`/api/chat/rooms/${roomId}/messages`)
      .then(response => {
        setMessages(response.data);
  
        // 기존 WebSocket 연결이 있을 경우 해제
        if (stompClient.current) {
          if (stompClient.current.connected) {
            stompClient.current.deactivate();  // 기존 WebSocket 연결 해제
            console.log("Previous WebSocket connection deactivated.");
          }
        }
        console.log("22")

        // 새로운 WebSocket 연결
        connectWebSocket(roomId);
        

      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  };

  // 메시지 전송
  const sendMessage = () => {
    if (newMessage.trim() && roomId) {
      const message = {
        content: newMessage,
        chatRoomId: roomId,
        sender: username,
        timestamp: new Date().toISOString()  // 시간 자동 생성
      };
  
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: `/app/chat.sendMessage/${roomId}`,
          body: JSON.stringify(message)
        });
        console.log("Message sent:", message);
        setNewMessage("");  // 입력창 초기화
      } else {
        console.error("WebSocket is not connected. Message not sent.");
      }
    }
  };

  // 새로운 채팅방을 생성하는 함수
  const createChatRoom = (username) => {
    axios.post('/api/chat/rooms', { name: username })
      .then(response => {
        const newRoom = response.data;
        setChatRooms([...chatRooms, newRoom]);  // 새로운 채팅방 추가
        navigate(`/chatroom/${newRoom.id}`);  // 생성된 채팅방으로 이동
        selectRoom(newRoom.id);  // 방 선택
      })
      .catch(error => {
        console.error('Error creating chat room:', error);
      });
  };

  const inviteUserToRoom = (roomId, username) => {
    axios.post(`/api/chat/rooms/${roomId}/invite`, { username })
      .then(response => {
        console.log(`${username} invited to room ${roomId}`);
      })
      .catch(error => {
        console.error('Error inviting user:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* 채팅방 목록 */}
      <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>채팅방 목록</h3>
        <ul>
          {chatRooms.map(room => (
            <li
              key={room.id}
              onClick={() => selectRoom(room.id)}
              style={{ cursor: 'pointer', padding: '10px', backgroundColor: roomId === room.id ? '#f0f0f0' : 'transparent' }}
            >
              {room.name}
            </li>
          ))}
        </ul>
        {/* 채팅방 생성 */}
        <input
          type="text"
          placeholder="Create new room..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              createChatRoom(e.target.value);
              e.target.value = '';  // 입력창 초기화
            }
          }}
        />
      </div>

      {/* 선택된 채팅방의 메시지 */}
      <div style={{ width: '70%', padding: '10px' }}>
        {roomId ? (
          <>
            <h3> 채팅 대화방 {roomId}</h3>
            <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
              {messages.map((message, index) => (
                <div key={index}>
                  <strong>{message.sender}:</strong> {message.content}<br/>
                  {message.timestamp}
                </div>
              ))}
            </div>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ width: '80%' }}
            />
            <button onClick={sendMessage} style={{ width: '20%' }}>Send</button>
          </>
        ) : (
          <h3>Select a chat room</h3>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
