import { Client } from "@stomp/stompjs"
import axios from "axios"
import { decodeToken } from "jsontokens"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import SockJS from "sockjs-client"

function KakaoRedirect(props) {
  // 로그인 성공시 MyPage로 이동
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stompClient = useRef(null) // WebSocket 연결 객체
  const [messages, setMessages] = useState([]) // 메시지 목록

  // 현재 사이트 URL 중 code 뒷 부분을 가져오는 코드
  const code = new URL(window.location.href).searchParams.get("code")

  const header = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  }
  // useEffect(함수, 반배열) 함수는 component가 활성화 될 때 최도 1번 호출된다.
  useEffect(() => {
    // 백엔드로에게 인가코드 넘기고 토큰받기
    axios
      .get("/api/v1/auth/kakao/accessTokenCallback?code=" + code, {
        headers: header,
      })
      .then((res) => {
        const token = res.data
        // window.localStorage.setItem("Token", token);
        // 로그인 성공 시 MyPage로 이동
        const authHeader = token.substring(7)
        if (token) {
          axios
            .get("/api/v1/auth/kakaoLogin", {
              headers: { Authorization: `Bearer ${token}`, header },
            })
            .then((res) => {
              // window.localStorage.setItem("kakaoId", JSON.stringify(res.data.id))
              processToken(res.data)
              window.location.reload() // 페이지 새로고침
            })
            .catch((error) => {
              console.log("kakao 정보 가져오기 실패")
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [code])

  const processToken = (data) => {
    if (data.token.startsWith("Bearer+")) {
      localStorage.setItem("token", data.token)
      const result = decodeToken(data.token.substring(7))

      const userData = {
        id: result.payload.id,
        username: result.payload.username,
        nickname: result.payload.nickname,
        profilePicture: result.payload.profilePicture,
      }

      const loginStatus = {
        isLogin: true,
        role: result.payload.role,
      }

      dispatch({ type: "LOGIN_USER", payload: { userData, loginStatus } })
      axios.defaults.headers.common["Authorization"] = data.token

      // WebSocket 연결
      connectWebSocket()

      if(data.isLoginChecked){
        navigate("/")
      }else if (!data.isLoginChecked){
        navigate("/completedSignup", { state: { isAllChecked : true } })
      }
      
      window.location.reload()
    }
  }

  // WebSocket 연결 함수
  const connectWebSocket = (roomId) => {
    const socket = new SockJS("/api/ws")
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        stompClient.current.subscribe(`/topic/room/${roomId}`, (messageOutput) => {
          const newMessage = JSON.parse(messageOutput.body)
          setMessages((prevMessages) => [...prevMessages, newMessage])
        })
      },

      onStompError: (error) => {
        console.error("STOMP error:", error)
      },

      onWebSocketClose: () => {
        console.log("WebSocket connection closed.")
      },
    })
    stompClient.current.activate()
  }

  return (
    <div>
      <p>카카오 로그인중입니다.</p>
    </div>
  )
}

export default KakaoRedirect
