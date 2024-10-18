import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React, { useState } from "react"

function ResetPassword(props) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isValidPassword, setIsValidPassword] = useState(false)
  const [isPasswordMatched, setIsPasswordMatched] = useState(false)

  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const [phoneNumberForUsername, setPhoneNumberForUsername] = useState("")
  const [isCodeSentForUsername, setIsCodeSentForUsername] = useState(false)
  const [foundUsername, setFoundUsername] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [hasLowerCase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)
  const [isValidLength, setIsValidLength] = useState(false)

  const [showPasswordValidateMessage, setShowPasswordValidateMessage] = useState(false)
  const [showConfirmPasswordValidateMessage, setShowConfirmPasswordValidateMessage] = useState(false)

  const [isAllChecked, setIsAllChecked] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const updateIsAllChecked = (updates = {}) => {
    const newState = {
      isVerified,
      isValidPassword,
      isPasswordMatched,
      ...updates,
    }

    const allChecked = Object.values(newState).every(Boolean)
    setIsAllChecked(allChecked)
  }

  const phoneNumberHandleChange = (e) => {
    const { name, value } = e.target
    // 숫자만 추출
    const numericValue = value.replace(/\D/g, "")
    // 전화번호 형식으로 변환
    const formattedValue = formatPhoneNumber(numericValue)
    if (name === "phoneNumber") {
      setPhoneNumber(formattedValue)
    } else {
      setPhoneNumberForUsername(formattedValue)
    }

    setIsVerified(false)
    updateIsAllChecked({ isVerified: false })
  }

  const verificationCodeHandleChange = (e) => {
    setVerificationCode(e.target.value)
    updateIsAllChecked()
  }

  //전화번호 포맷처리 함수
  const formatPhoneNumber = (value) => {
    if (value.length <= 3) return value
    if (value.length <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`
    if (value.length <= 10) return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
  }

  const sendVerificationCode = (type) => {
    let inputPhoneNumber = ""
    if (type === "username") {
      inputPhoneNumber = phoneNumberForUsername.replace(/\D/g, "")
    } else {
      inputPhoneNumber = phoneNumber.replace(/\D/g, "")
    }
    console.log(inputPhoneNumber)
    //인증요청 전송 api
    axios
      .post("/api/v1/auth/phone/forgot-credentials/send-code", { username, phoneNumber: inputPhoneNumber })
      .then((response) => {
        if (username === "") {
          setIsCodeSentForUsername(true)
        } else {
          setIsCodeSent(true)
        }
        alert("인증 코드가 전송되었습니다.")
      })
      .catch((error) => {
        console.log(error)
        alert("인증 코드 전송에 실패했습니다.")
      })
  }

  const verifyPhoneNumber = (type) => {
    let inputPhoneNumber = ""
    if (type === "username") {
      inputPhoneNumber = phoneNumberForUsername.replace(/\D/g, "")
    } else {
      inputPhoneNumber = phoneNumber.replace(/\D/g, "")
    }

    //인증 확인 api
    axios
      .post("/api/v1/auth/phone/forgot-credentials/verify-code", {
        phoneNumber: inputPhoneNumber,
        code: verificationCode,
      })
      .then((response) => {
        alert("휴대폰 번호가 성공적으로 인증되었습니다.")

        if (username !== "") {
          setIsVerified(true)
        }

        axios
          .post("/api/v1/auth/phone/forgot-credentials/find-username", inputPhoneNumber)
          .then((response) => {
            setFoundUsername(response.data)
            setUsername(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
        alert("인증 코드가 잘못되었습니다.")
      })
  }

  const passwordHandleChange = (e) => {
    const value = e.target.value
    setPassword(value)

    // 비밀번호 : 영어 대소문자, 숫자, 특수문자를 포함한 8~15자리
    const lowerCase = /[a-z]/.test(value)
    const upperCase = /[A-Z]/.test(value)
    const number = /\d/.test(value)
    const specialChar = /[!@#$%^&*]/.test(value)
    const validLength = value.length >= 8 && value.length <= 15

    setHasLowerCase(lowerCase)
    setHasUpperCase(upperCase)
    setHasNumber(number)
    setHasSpecialChar(specialChar)
    setIsValidLength(validLength)

    // 비밀번호 유효성 체크 및 메시지 표시 여부 결정
    const validPassword = lowerCase && upperCase && number && specialChar && validLength
    setIsValidPassword(validPassword)

    // 비밀번호가 입력되지 않은 경우 메시지 숨기기
    setShowPasswordValidateMessage(value !== "" && !validPassword)

    updateIsAllChecked({ isValidPassword: validPassword })
  }

  //비밀번호 확인
  const confirmPasswordHandleChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    const passwordMatched = validateConfirmPassword(value)
    setIsPasswordMatched(passwordMatched)

    // 비밀번호 확인이 입력되지 않은 경우 메시지 숨기기
    setShowConfirmPasswordValidateMessage(value !== "" && !passwordMatched)

    updateIsAllChecked({ isPasswordMatched: passwordMatched })
  }

  //비밀번호 일치 여부 검사
  const validateConfirmPassword = (value) => password === value || value === ""

  //비밀번호 보이기/숨기기
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    if (!isAllChecked) {
      alert("모든 항목을 올바르게 입력해주세요.")
      return
    }
    //비밀번호 리셋 api
    axios
      .post(`/api/v1/users/reset-password`, {
        username,
        password,
        confirmPassword,
      })
      .then((res) => {})
      .catch((error) => {
        console.error("비밀번호 변경에 실패하였습니다")
      })
  }

  return (
    <>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">비밀번호 재설정</h2>
        </div>
        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div>
            {/* 아이디 중복 검사 (있어야됨) 기능 구현 */}
            <div className="sm:col-span-6">
              <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
                아이디
              </label>
              <div className="mt-2.5 flex">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                  }}
                  className="block w-4/5 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="ml-2 min-w-28 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  아이디 찾기
                </button>
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-1/4 p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg font-semibold">아이디 찾기</h3>
                      <div className="sm:col-span-6 mt-3">
                        <label htmlFor="phoneNumber" className="block text-sm font-semibold leading-6 text-gray-900">
                          휴대전화번호
                        </label>
                        <div className="mt-2.5 flex">
                          <input
                            id="phoneNumberForUsername"
                            name="phoneNumberForUsername"
                            type="tel"
                            value={phoneNumberForUsername}
                            onChange={phoneNumberHandleChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => sendVerificationCode("username")}
                            className="ml-4 min-w-36 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            인증 코드 전송
                          </button>
                        </div>
                      </div>
                      {/* 인증 코드 입력 */}
                      {isCodeSentForUsername && (
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="verificationCode"
                            className="block text-sm font-semibold leading-6 text-gray-900">
                            인증 코드
                          </label>
                          <div className="mt-2.5 flex">
                            <input
                              id="verificationCode"
                              name="verificationCode"
                              type="text"
                              value={verificationCode}
                              onChange={verificationCodeHandleChange}
                              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button
                              type="button"
                              onClick={() => verifyPhoneNumber("username")}
                              className="ml-4 min-w-24 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                              인증 확인
                            </button>
                          </div>
                        </div>
                      )}
                      {foundUsername && (
                        <div className="text-2xl font-bold text-center mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
                          아이디 : <span className="text-tripDuoGreen">{foundUsername}</span>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                          닫기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 핸드폰 인증 */}
            <div className="sm:col-span-6">
              <label htmlFor="phoneNumber" className="block text-sm font-semibold leading-6 text-gray-900">
                휴대전화번호
              </label>
              <div className="mt-2.5 flex">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={isVerified ? null : phoneNumberHandleChange} // isVerified가 true일 때 입력란 잠금
                  className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    isVerified ? "bg-gray-200 cursor-not-allowed" : ""
                  }`} // 잠금 시 스타일 변경
                  disabled={isVerified} // isVerified가 true일 때 입력란 비활성화
                  required
                />
                <button
                  type="button"
                  onClick={() => sendVerificationCode("password")}
                  className="ml-4 min-w-36 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={isVerified} // isVerified가 true일 때 버튼 비활성화
                >
                  인증 코드 전송
                </button>
              </div>
            </div>

            {/* 인증 코드 입력 */}
            {isCodeSent && (
              <div className="sm:col-span-6">
                <label htmlFor="verificationCode" className="block text-sm font-semibold leading-6 text-gray-900">
                  인증 코드
                </label>
                <div className="mt-2.5 flex">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={isVerified ? null : verificationCodeHandleChange} // isVerified가 true일 때 입력란 잠금
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      isVerified ? "bg-gray-200 cursor-not-allowed" : ""
                    }`} // 잠금 시 스타일 변경
                    disabled={isVerified} // isVerified가 true일 때 입력란 비활성화
                  />
                  <button
                    type="button"
                    onClick={() => verifyPhoneNumber("password")}
                    className="ml-4 min-w-24 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={isVerified} // isVerified가 true일 때 버튼 비활성화
                  >
                    인증 확인
                  </button>
                </div>
              </div>
            )}
            {/* 안증 코드 확인되면 > 비밀번호 입력 가능 */}
            {isVerified && (
              <>
                <div className="sm:col-span-6">
                  <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
                    비밀번호
                  </label>
                  <div className="mt-2.5 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={passwordHandleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-500 h-10 w-10">
                      {showPassword ? (
                        // 비밀번호 보이기 (Eye Icon)
                        <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                      ) : (
                        // 비밀번호 숨기기 (Eye Slash Icon)
                        <FontAwesomeIcon icon={faEyeSlash} className="h-5 w-5" />
                      )}
                    </button>
                    {showPasswordValidateMessage && (
                      <div className="mt-2 text-sm">
                        <p>
                          비밀번호는 영어
                          <span className={hasLowerCase ? "text-blue-600" : "text-red-600"}> 소문자</span>,
                          <span className={hasUpperCase ? "text-blue-600" : "text-red-600"}> 대문자</span>,
                          <span className={hasNumber ? "text-blue-600" : "text-red-600"}> 숫자</span>,
                          <span className={hasSpecialChar ? "text-blue-600" : "text-red-600"}> 특수문자</span>를 포함한
                          <span className={isValidLength ? "text-blue-600" : "text-red-600"}> 8~15자리</span>여야
                          합니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold leading-6 text-gray-900">
                    비밀번호 확인
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={confirmPasswordHandleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                    {showConfirmPasswordValidateMessage && (
                      <div className="mt-2 text-sm">
                        <p className="mt-2 text-sm text-red-600">비밀번호가 일치하지 않습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-10">
            <button
              type="button"
              className={`block w-full rounded-md ${
                !isAllChecked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              } px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              disabled={!isAllChecked} // 인증 성공 후에만 버튼 활성화
              onClick={handleSignUp}>
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ResetPassword
