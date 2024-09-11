import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

function Signup() {
  const location = useLocation()
  const { termsService, termsPrivacy, essential } = location.state || {}
  const navigate = useNavigate()
  //약관동의 필수항목 체크 안하고 접근시 리다이렉트
  useEffect(() => {
    if (!(termsService && termsPrivacy && essential)) {
      alert("회원가입을 위해선 약관동의가 필요합니다.");
      navigate("/agreement");
    }
  }, [])

  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [isValidUsername, setIsValidUsername] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [isValidNickname, setIsValidNickname] = useState(true)
  const [isValidEmail, setIsValidEmail] = useState(true)

  //아이디, 닉네임 사용중인지
  const [isUsernameExist, setIsUsernameExist] = useState(false)
  const [isNicknameExist, setIsNicknameExist] = useState(false)
  //아이디, 닉네임 중복검사 통과 했는지
  const [isUsernameUnique, setIsUsernameUnique] = useState(false)
  const [isNicknameUnique, setIsNicknameUnique] = useState(false)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordMatched, setIsPasswordMatched] = useState(true)
  const [hasLowerCase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)
  const [isValidLength, setIsValidLength] = useState(false)
  const [showValidationMessage, setShowValidationMessage] = useState(false)

  const [email, setEmail] = useState('')

  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const [isAllChecked, setIsAllChecked] = useState(false)


  const validateUsername = (value) => {
    // 아이디 : 영어 소문자와 숫자로 이루어진 6~16자리
    const regex = /^[a-z0-9]{6,16}$/
    return regex.test(value) || value === ""
  }
  //비밀번호 일치 여부 검사
  const validateConfirmPassword = (value) => password === value || value === ""

  //비밀번호 보이기/숨기기
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  };

  const validateNickname = (value) => {
    // 닉네임 : 한글, 영어 대소문자, 숫자로 이루어진 2~16자리
    const regex = /^[가-힣a-zA-Z0-9]{2,16}$/
    return regex.test(value) || value === ""
  }
  const validateEmail = (value) => {
    // 이메일 : 이메일 형식
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(value) || value === ""
  }
  const updateIsAllChecked = (validUsername, validPassword, passwordMatched, validNickname, validEmail, isVerified) => {
    setIsAllChecked(validUsername && validPassword && passwordMatched && validNickname && validEmail && isVerified && isUsernameUnique && isNicknameUnique)
  }

  //아이디, 닉네임 중복검사
  const checkUsernameAvailability = (username) => {
    axios.post(`/api/v1/users/check/username`, username, {
      headers: { 'Content-Type': 'text/plain' },
    })
      .then((response) => {
        if (response.data) {
          setIsUsernameExist(true)
        } else {
          alert("사용 가능한 아이디입니다.")
          setIsUsernameUnique(true)
          updateIsAllChecked()
        }
      })
      .catch(() => {
        alert("중복 확인에 실패했습니다.")
      })
  }

  const checkNicknameAvailability = (nickname) => {
    axios.post(`/api/v1/users/check/nickname`, nickname, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response => {
        if (response.data) {
          setIsNicknameExist(true)
        } else {
          alert("사용 가능한 닉네임 입니다.")
          setIsNicknameUnique(true)
          updateIsAllChecked()
        }
      })
      .catch(() => {
        alert("중복 확인에 실패했습니다.")
      })
  }


  const handleCheckUsername = () => {
    if (isValidUsername) {
      checkUsernameAvailability(username);
    } else alert("아이디 형식에 맞지 않습니다")
  }

  const handleCheckNickname = () => {
    if (isValidUsername) {
      checkNicknameAvailability(nickname);
    } else alert("닉네임 형식에 맞지 않습니다")
  };

  const usernameHandleChange = (e) => {
    const value = e.target.value
    setUsername(value)
    const validUsername = validateUsername(value)
    setIsValidUsername(validUsername)

    updateIsAllChecked(validUsername, isValidPassword, isPasswordMatched, isValidNickname, isValidEmail, isVerified)
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
    setShowValidationMessage(value !== "" && !validPassword)

    updateIsAllChecked(isValidUsername, validPassword, isValidNickname, isValidEmail, isVerified)
  }
  //비밀번호 확인
  const confirmPasswordHandleChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    const passwordMatched = validateConfirmPassword(value)
    setIsPasswordMatched(passwordMatched)

    updateIsAllChecked(isValidUsername, isValidPassword, passwordMatched, isValidNickname, isValidEmail, isVerified)
  }

  const nicknameHandleChange = (e) => {
    const value = e.target.value
    setNickname(value)
    const validNickname = validateNickname(value)
    setIsValidNickname(validNickname)

    updateIsAllChecked(isValidUsername, isValidPassword, isPasswordMatched, validNickname, isValidEmail, isVerified)
  }

  const phoneNumberHandleChange = (e) => {
    const { value } = e.target;
    // 숫자만 추출
    const numericValue = value.replace(/\D/g, '');
    // 전화번호 형식으로 변환
    const formattedValue = formatPhoneNumber(numericValue);
    setPhoneNumber(formattedValue)
  }
  //전화번호 포맷처리 함수
  const formatPhoneNumber = (value) => {
    if (value.length <= 3) return value;
    if (value.length <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`;
    if (value.length <= 10) return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  }
  //실제 저장용 값('-' 제거)
  const getUnformattedPhoneNumber = () => phoneNumber.replace(/\D/g, '')

  const emailHandleChange = (e) => {
    const value = e.target.value
    const validEmail = validateEmail(value)
    setEmail(value)
    setIsValidEmail(validEmail)
    updateIsAllChecked(isValidUsername, isValidPassword, isPasswordMatched, isValidNickname, validEmail, isVerified)
  }

  const verificationCodeHandleChange = (e) => {
    setVerificationCode(e.target.value)
  }

  const sendVerificationCode = () => {
    //인증요청 전송 api
    axios.post('/api/v1/auth/phone/send-code', phoneNumber)
      .then((response) => {
        setIsCodeSent(true)
        alert('인증 코드가 전송되었습니다.')
      })
      .catch((error) => {
        alert('인증 코드 전송에 실패했습니다.')
      })
  }
  const verifyPhoneNumber = () => {
    const code = verificationCode
    //인증 확인 api
    axios.post('/api/v1/auth/phone/verify-code', { phoneNumber, code })
      .then((response) => {
        setIsVerified(true)
        updateIsAllChecked(isValidUsername, isValidPassword, isPasswordMatched, isValidNickname, isValidEmail, true)
        alert('휴대폰 번호가 성공적으로 인증되었습니다.')
      })
      .catch((error) => {
        alert('인증 코드가 잘못되었습니다.')
      })
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    try {
      //회원가입 api
      axios.post(`/api/v1/auth/signup`, { username, password, confirmPassword, nickname, phoneNumber, email })
        .then((response) => {
          // 회원가입 성공시 토큰 발급으로 로그인 처리
          const token = response.data
          localStorage.setItem('token', token)
          axios.defaults.headers.common["Authorization"] = token
          navigate("/completedSignup", { state: { isAllChecked } })
        })
        .catch((error) => {
          console.error('회원가입에 실패하였습니다')
        })
    } catch (error) {
      console.error('회원가입에 실패하였습니다')
    }
  }

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">회원가입</h2>
      </div>
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
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
                onChange={usernameHandleChange}
                className="block w-4/5 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              <button
                type="button"
                onClick={handleCheckUsername}
                className="ml-2 w-1/5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                아이디<br />중복 확인
              </button>
            </div>
            {!isValidUsername && (
              <p className="mt-2 text-sm text-red-600">
                아이디는 영어 소문자와 숫자로 이루어진 6~16자리여야 합니다.
              </p>
            )}
            {isUsernameExist && (
              <p className="mt-2 text-sm text-red-600">
                이미 사용중인 아이디입니다.
              </p>
            )}

          </div>

          <div className="sm:col-span-6">
            <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
              비밀번호
            </label>
            <div className="mt-2.5 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={passwordHandleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-500 h-10 w-10"
              >
                {showPassword ? (
                  // 비밀번호 보이기 (Eye Icon)
                  <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                ) : (
                  // 비밀번호 숨기기 (Eye Slash Icon)
                  <FontAwesomeIcon icon={faEyeSlash} className="h-5 w-5" />
                )}
              </button>
              {showValidationMessage && (
                <div className="mt-2 text-sm">
                  <p>비밀번호는 영어
                    <span className={hasLowerCase ? 'text-blue-600' : 'text-red-600'}> 소문자</span>,
                    <span className={hasUpperCase ? 'text-blue-600' : 'text-red-600'}> 대문자</span>,
                    <span className={hasNumber ? 'text-blue-600' : 'text-red-600'}> 숫자</span>,
                    <span className={hasSpecialChar ? 'text-blue-600' : 'text-red-600'}> 특수문자</span>를 포함한
                    <span className={isValidLength ? 'text-blue-600' : 'text-red-600'}> 8~15자리</span>여야 합니다.
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
              {!isPasswordMatched && (
                <div className="mt-2 text-sm">
                  <p className="mt-2 text-sm text-red-600">
                    비밀번호가 일치하지 않습니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="nickname" className="block text-sm font-semibold leading-6 text-gray-900">
              닉네임
            </label>
            <div className="mt-2.5 flex">
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={nickname}
                onChange={nicknameHandleChange}
                className="block w-4/5 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="ml-2 w-1/5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                닉네임<br />중복 확인
              </button>
              {!isValidNickname && (
                <p className="mt-2 text-sm text-red-600">
                  닉네임은 한글, 영어 대소문자, 숫자로 이루어진 2~16자리여야 합니다.
                </p>
              )}
              {isNicknameExist && (
                <p className="mt-2 text-sm text-red-600">
                  이미 사용중인 닉네임 입니다.
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={emailHandleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              {!isValidEmail && (
                <p className="mt-2 text-sm text-red-600">
                  이메일 형식에 맞게 작성해야 합니다.
                </p>
              )}
            </div>
          </div>

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
                onChange={phoneNumberHandleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              <button
                type="button"
                onClick={() => sendVerificationCode(getUnformattedPhoneNumber())}
                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                  onChange={verificationCodeHandleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={verifyPhoneNumber}
                  className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  인증 확인
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <button
            type="button"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={!isAllChecked}  // 인증 성공 후에만 버튼 활성화
            onClick={handleSignUp}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  )
}

export default Signup