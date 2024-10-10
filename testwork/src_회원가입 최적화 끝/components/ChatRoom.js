import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router"
import { shallowEqual, useSelector } from "react-redux"
import useWebSocket from "../components/useWebSocket"
import Modal from "react-modal" // 모달 라이브러리 추가

// 모달 스타일 설정
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

function ChatRoom() {
  const { stompClient, messages, setMessages, notifications, setNotifications } = useWebSocket()

  const [newMessage, setNewMessage] = useState("")
  const [chatRooms, setChatRooms] = useState([])
  const [selectedRoomIds, setSelectedRoomIds] = useState([]) // 여러 채팅방 구독을 위한 배열
  const [recipient, setRecipient] = useState("") // 1:1 채팅을 위한 수신자
  const [notification, setNotification] = useState("")
  const { roomId } = useParams() // URL에서 roomId 가져오기
  const [currentRoomId, setCurrentRoomId] = useState()
  const [participantsList, setParticipantsList] = useState([]) // 사용자 목록
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState("") // 선택된 사용자
  const [selectedUsers, setSelectedUsers] = useState([]) // 다중 선택된 사용자
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
  const [modalType, setModalType] = useState("") // 모달 타입 (1:1 또는 그룹)
  const [subscribedRoomIds, setSubscribedRoomIds] = useState([]) // 내가 구독한 목록
  const currentUserId = useSelector((state) => state.userData.id, shallowEqual) // 유저네임 불러오기
  const CurrentUsername = useSelector((state) => state.userData.username, shallowEqual)
  const currentUserNickname = useSelector((state) => state.userData.nickname, shallowEqual)
  const currentUserProfilePicture = useSelector((state) => state.userData.profilePicture, shallowEqual)

  const [userProfileInfo, setUserProfileInfo] = useState({
    id: currentUserId,
    nickname: currentUserNickname,
    profilePicture: currentUserProfilePicture,
  })

  // 채팅방 생성 상태를 초기화하는 함수
  const initializeChatRoom = () => ({
    type: modalType === "ONE_ON_ONE" ? "ONE_ON_ONE" : "GROUP",
    title: modalType === "ONE_ON_ONE" ? `${CurrentUsername}와 ${selectedUser}의 1:1 채팅` : "그룹 채팅",
    ownerId: currentUserId,
    participantsList: modalType === "ONE_ON_ONE" ? [currentUserId, selectedUser] : [currentUserId, ...selectedUsers],
  })

  // 채팅방 목록을 불러오기 위한 useEffect
  useEffect(() => {
    axios
      .get("/api/chat/rooms", { params: { userId: currentUserId } })
      .then((response) => {
        setChatRooms(response.data)
      })
      .catch((error) => {
        console.error("Error fetching chat rooms", error)
      })

    axios
      .get("/api/v1/users")
      .then((response) => {
        setParticipantsList(response.data) // 사용자 목록 설정
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching users", error)
      })
  }, [currentUserId])

  // 알림 구독
  useEffect(
    (room) => {
      if (stompClient && stompClient.connected) {
        if (!subscribedRoomIds.includes(currentRoomId)) {
          stompClient.subscribe("/notification", (message) => {
            const parsedNotification = JSON.parse(message.body)

            if (parsedNotification.type === "CHATROOM") {
              // 새로운 채팅방이 생성되었을 때 채팅방 목록을 업데이트
              axios
                .get("/api/chat/rooms", { params: { userId: currentUserId } })
                .then((response) => {
                  setChatRooms(response.data)
                })
                .catch((error) => {
                  console.error("Error fetching chat rooms", error)
                })
            }

            setNotifications((prevNotifications) => [...prevNotifications, parsedNotification])
          })
        }
      }
    },
    [stompClient, chatRooms, subscribedRoomIds]
  )

  // 채팅방 메세지 전송 구독 설정
  useEffect(() => {
    if (stompClient) {
      chatRooms.forEach((room) => {
        if (!subscribedRoomIds.includes(room.id)) {
          const topic = room.type === "ONE_ON_ONE" ? `/user/private/${room.id}` : `/topic/group/${room.id}`
          stompClient.subscribe(topic, (message) => {
            const parsedMessage = JSON.parse(message.body)

            setMessages((prevMessages) => [...prevMessages, parsedMessage])
          })
          setSubscribedRoomIds((prevIds) => [...prevIds, room.id])
          subscribedRoomIds.push(roomId) // 구독한 방 ID를 기록
        }
      })
    }
  }, [stompClient, chatRooms, subscribedRoomIds])

  const createChatRoom = (chatRoom) => {
    if (stompClient && stompClient.connected) {
      axios
        .post("/api/chat/rooms", chatRoom)
        .then((response) => {
          const newRoom = response.data
          console.log(newRoom)
          // 새로운 방이 생성되었음을 알리는 알림 추가
          const notification = {
            message: `${CurrentUsername}님이 "${newRoom.title}" 방을 생성했습니다.`,
            type: "CHATROOM",
            roomId: newRoom.id, // 추가된 부분
            timestamp: new Date().toLocaleString(),
          }

          console.log(notification)
          stompClient.publish({
            destination: `/app/notification`,
            body: JSON.stringify(notification),
          })

          // chatRooms 상태 업데이트
          // setChatRooms((prevRooms) => [...prevRooms, newRoom]);

          // 생성된 채팅방 구독 설정
          const chatRoomTopic =
            newRoom.type === "ONE_ON_ONE" ? `/user/newroom/private/${newRoom.id}` : `/topic/newroom/group/${newRoom.id}`
          stompClient.subscribe(chatRoomTopic, (chatRoom) => {
            const parsedMessage3 = JSON.parse(chatRoom.body)
            setChatRooms((prevRooms) => [...prevRooms, parsedMessage3])
          })

          // 생성된 채팅방에 메세지 구독 설정
          const topic = newRoom.type === "ONE_ON_ONE" ? `/user/private/${newRoom.id}` : `/topic/group/${newRoom.id}`
          stompClient.subscribe(topic, (message) => {
            const parsedMessage = JSON.parse(message.body)
            setMessages((prevMessages) => [...prevMessages, parsedMessage])
          })

          setSubscribedRoomIds((prevIds) => [...prevIds, newRoom.id])

          setMessages((prevMessages) => [...prevMessages, newRoom])

          // 생성된 채팅방으로 이동
          navigate(`/chatroom/${newRoom.id}`)
          selectRoom(newRoom.id) // 방 선택
        })
        .catch((error) => {
          console.error("Error creating chat room:", error)
        })
    }
  }

  // 채팅방 선택시 메시지 불러오기
  const selectRoom = (roomId) => {
    setCurrentRoomId(roomId) // 새로운 상태 추가
    navigate(`/chatroom/${roomId}`) // 페이지 이동

    // 구독이 이미 추가된 방인지 확인 후, 중복 구독 방지
    if (!subscribedRoomIds.includes(roomId)) {
      setSubscribedRoomIds((prevIds) => [...prevIds, roomId]) // subscribedRoomIds에 roomId 추가

      // 선택한 방에 메세지 구독 설정
      if (stompClient && stompClient.connected) {
        const chatMessageroom = chatRooms.find((room) => room.id === roomId)
        if (chatMessageroom) {
          const chatMessagetopic =
            chatMessageroom.type === "ONE_ON_ONE"
              ? `/user/private/${chatMessageroom.id}`
              : `/topic/group/${chatMessageroom.id}`
          stompClient.subscribe(chatMessagetopic, (message) => {
            const parsedMessage = JSON.parse(message.body)
            setMessages((prevMessages) => [...prevMessages, parsedMessage]) // 다른 사용자 메시지 추가
          })
          // 선택한 방에 구독 설정
          const topic =
            chatMessageroom.type === "ONE_ON_ONE"
              ? `/user/newroom/private/${chatMessageroom.id}`
              : `/topic/newroom/group/${chatMessageroom.id}`
          stompClient.subscribe(topic, (message) => {
            const parsedMessage = JSON.parse(message.body)
            setMessages((prevMessages) => [...prevMessages, parsedMessage]) // 다른 사용자 메시지 추가
          })
        }
      }
    }
    // 이전 채팅 메시지를 가져옵니다
    axios
      .get(`/api/chat/rooms/${roomId}/getMessages`)
      .then((response) => {
        setMessages(response.data)
      })
      .catch((error) => {
        console.error("Error fetching messages:", error)
      })
  }

  // 메시지 전송
  const sendMessage = () => {
    if (newMessage.trim() && currentRoomId) {
      const message = {
        id: null,
        message: newMessage,
        userProfileInfo,
        chatRoomId: currentRoomId,
        timestamp: new Date().toISOString(),
      }

      const destination =
        chatRooms.find((room) => room.id === currentRoomId).type === "ONE_ON_ONE"
          ? `/app/chat.sendMessage/private/${currentRoomId}`
          : `/app/chat.sendMessage/group/${currentRoomId}`

      stompClient.publish({
        destination,
        body: JSON.stringify(message),
      })

      // 알림 추가
      const notification = {
        message: `${CurrentUsername}님이 메시지를 보냈습니다.`,
        type: "MESSAGE",
        timestamp: new Date().toLocaleString(),
      }

      stompClient.publish({
        destination: `/app/notification`,
        body: JSON.stringify(notification),
      })

      setNewMessage("")
    }
  }

  // 알림 보내기
  const sendNotification = () => {
    if (stompClient && stompClient.connected) {
      const notification = {
        message: CurrentUsername,
        timestamp: new Date().toLocaleString(),
      }
      stompClient.publish({
        destination: `/app/notification`,
        body: JSON.stringify(notification),
      })
      setNotification("")
    }
  }

  // 알림 삭제
  const clearNotification = () => {
    setNotifications([])
  }

  // 모달 열기
  const openModal = (type) => {
    setModalType(type)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser("")
    setSelectedUsers([])
  }

  // 1:1 채팅방 생성
  const createPrivateChatRoom = () => {
    if (selectedUser !== "") {
      const chatRoom = initializeChatRoom()
      createChatRoom(chatRoom)
      closeModal()
    }
  }

  // 그룹 채팅방 생성
  const createGroupChatRoom = () => {
    if (selectedUsers.length > 0) {
      const chatRoom = initializeChatRoom()
      createChatRoom(chatRoom)
      closeModal()
    }
  }

  // 구독한 방 목록을 출력
  const handleShowSubscribedRooms = () => {
    alert(`구독한 채팅방 ID: ${subscribedRoomIds.join(", ")}`)
  }

  //프로필 이미지 스타일
  const profileStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid #cecece",
    borderRadius: "50%",
  }

  return (
    <div className="flex flex-row">
      <div className="w-1/3 p-2 border-r border-gray-300">
        <button onClick={handleShowSubscribedRooms} className="mb-2 p-2 bg-blue-500 text-white rounded">
          구독한 채팅방 보기
        </button>

        {/* 사용자 초대 UI */}
        <div>
          <div className="mb-2">
            <button onClick={() => openModal("ONE_ON_ONE")} className="mr-3 my-3 p-2 bg-green-500 text-white rounded">
              1:1채팅
            </button>
            <button onClick={() => openModal("GROUP")} className="p-2 bg-green-500 text-white rounded">
              Group 채팅
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2">채팅방 목록</h3>
        {/* 채팅방 목록 */}
        <ul>
          {chatRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className={`cursor-pointer p-2 ${
                currentRoomId === room.id
                  ? "bg-blue-200"
                  : subscribedRoomIds.includes(room.id)
                  ? "bg-gray-200"
                  : "bg-transparent"
              }`}>
              {room.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 p-2">
        <h3 className="text-lg font-bold mb-2">채팅방</h3>
        <div className="h-96 overflow-y-scroll border border-gray-300 p-2">
          {messages
            .filter((message) => message.chatRoomId === currentRoomId)
            .map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  message.userProfileInfo.id === currentUserId ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`p-2 flex rounded ${
                    message.userProfileInfo.id === currentUserId ? "bg-blue-200" : "bg-gray-200"
                  }`}>
                  {message.userProfileInfo.profilePicture === null ? (
                    <svg
                      style={profileStyle}
                      xmlns="http://www.w3.org/2000/svg"
                      width="2"
                      height="2"
                      fill="currentColor"
                      viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path
                        fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                      />
                    </svg>
                  ) : (
                    <img
                      src={message.userProfileInfo.profilePicture}
                      alt="profile"
                      className="w-12 h-12 inline-block mr-2"
                    />
                  )}
                  <div style={{ wordBreak: "break-word" }}>
                    <strong>{message.userProfileInfo.nickname}:</strong> {message.message}
                    <br />
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex mt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="w-4/5 p-2 border border-gray-300 rounded"
          />
          <button onClick={sendMessage} className="w-1/5 p-2 bg-blue-500 text-white rounded">
            전송
          </button>
        </div>
      </div>

      <div className="w-1/3 p-2 border-l border-gray-300">
        <h3 className="text-lg font-bold mb-2">알림</h3>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="mb-1">
              {notification.message} - {notification.timestamp}
            </li>
          ))}
        </ul>
        <button onClick={sendNotification} className="mb-2 p-2 bg-blue-500 text-white rounded">
          알림 보내기
        </button>
        <br />
        <button onClick={clearNotification} className="mb-2 p-2 bg-red-500 text-white rounded">
          clear
        </button>
        <br />
        <button onClick={() => console.log(messages)} className="mb-2 p-2 bg-gray-500 text-white rounded">
          messages test
        </button>
        <br />
        <button onClick={() => console.log(subscribedRoomIds)} className="mb-2 p-2 bg-gray-500 text-white rounded">
          subscribedRoomIds test2
        </button>
        <br />
        <button onClick={() => console.log(currentRoomId)} className="mb-2 p-2 bg-gray-500 text-white rounded">
          currentRoomId test
        </button>
      </div>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="채팅방 생성"
        ariaHideApp={false}>
        <h2 className="text-lg font-bold mb-2">{modalType === "ONE_ON_ONE" ? "1:1 채팅" : "그룹 채팅"} 방 생성</h2>
        <div>
          {modalType === "ONE_ON_ONE" ? (
            <select
              onChange={(e) => setSelectedUser(e.target.value)}
              value={selectedUser}
              className="p-2 border border-gray-300 rounded">
              <option value="">사용자를 선택하세요</option>
              {participantsList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          ) : (
            <div>
              {participantsList.map((user) => (
                <div key={user.id} className="mb-2 flex items-center">
                  <label htmlFor={`user-${user.id}`} className="ml-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      value={user.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, e.target.value])
                        } else {
                          setSelectedUsers(selectedUsers.filter((id) => id !== e.target.value))
                        }
                      }}
                      className="mr-2"
                    />
                    {user.username}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={modalType === "ONE_ON_ONE" ? createPrivateChatRoom : createGroupChatRoom}
          className="mt-2 p-2 bg-blue-500 text-white rounded">
          채팅방 생성
        </button>
        <button onClick={closeModal} className="mt-2 p-2 bg-red-500 text-white rounded">
          취소
        </button>
      </Modal>
    </div>
  )
}

export default ChatRoom
