import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { decodeToken } from 'jsontokens';
import { useDispatch } from 'react-redux';

function Signup() {
  const location = useLocation()
  const { termsService, termsPrivacy, essential } = location.state || {}
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //약관동의 필수항목 체크 안하고 접근시 리다이렉트
  useEffect(() => {
    if (!(termsService && termsPrivacy && essential)) {
      alert("회원가입을 위해선 약관동의가 필요합니다.");
      navigate("/agreement");
    }
  }, [termsService, termsPrivacy, essential, navigate])

  //상태관리
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [isValidNickname, setIsValidNickname] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)

  //아이디, 닉네임 사용중인지
  const [isUsernameExist, setIsUsernameExist] = useState(false)
  const [isNicknameExist, setIsNicknameExist] = useState(false)
  //아이디, 닉네임 중복검사 통과 했는지
  const [isUsernameUnique, setIsUsernameUnique] = useState(false)
  const [isNicknameUnique, setIsNicknameUnique] = useState(false)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordMatched, setIsPasswordMatched] = useState(false)
  const [hasLowerCase, setHasLowerCase] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)
  const [isValidLength, setIsValidLength] = useState(false)

  const [showUsernameValidateMessage, setShowUsernameValidateMessage] = useState(false)
  const [showPasswordValidateMessage, setShowPasswordValidateMessage] = useState(false)
  const [showConfirmPasswordValidateMessage, setShowConfirmPasswordValidateMessage] = useState(false)
  const [showNicknameValidateMessage, setShowNicknameValidateMessage] = useState(false)
  const [showEmailValidateMessage, setShowEmailValidateMessage] = useState(false)

  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const [isAllChecked, setIsAllChecked] = useState(false)

  //유효성 검사 함수
  // 아이디 : 영어 소문자와 숫자로 이루어진 6~16자리
  const validateUsername = (value) => /^[a-z0-9]{6,16}$/.test(value) || value === ""
  // 닉네임 : 한글, 영어 대소문자, 숫자로 이루어진 2~16자리
  const validateNickname = (value) => /^[가-힣a-zA-Z0-9]{2,16}$/.test(value) || value === ""
  // 이메일 : 이메일 형식
  const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value === ""
  // 비밀번호 일치 여부 검사
  const validateConfirmPassword = (value) => password === value || value === ""

  //비밀번호 보이기/숨기기
  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  
  //모든 유효성 검사 통과했는지 검사
  const updateIsAllChecked = (updates = {}) => {
    const newState = {
      isValidUsername,
      isValidPassword,
      isPasswordMatched,
      isValidNickname,
      isValidEmail,
      isVerified,
      isUsernameUnique,
      isNicknameUnique,
      ...updates
    }
    setIsAllChecked(Object.values(newState).every(Boolean))
  }

  //아이디, 닉네임 중복검사
  const checkAvailability = (type, value, setExist, setUnique) => {
    axios.post(`/api/v1/users/check/${type}`, value, {
      headers: { 'Content-Type': 'text/plain' },
    })
      .then((res) => {
        if (res.data) {
          setExist(true)
          updateIsAllChecked({ [type === 'username' ? 'isUsernameUnique' : 'isNicknameUnique']: false })
        } else {
          alert(`사용 가능한 ${type === 'username' ? '아이디' : '닉네임'} 입니다.`)
          setExist(false)
          setUnique(true)
          updateIsAllChecked({ [type === 'username' ? 'isUsernameUnique' : 'isNicknameUnique']: true })
        }
      })
      .catch(() => {
        alert("중복 확인에 실패했습니다.")
        updateIsAllChecked({ [type === 'username' ? 'isUsernameUnique' : 'isNicknameUnique']: false })
      })
  }

  //아이디 중복 확인
  const handleCheckUsername = () => {
    if (isValidUsername) {
      checkAvailability('username', username, setIsUsernameExist, setIsUsernameUnique)
    } else {
      alert("아이디 형식에 맞지 않습니다")
      updateIsAllChecked({ isUsernameUnique: false })
    }
  }

  //닉네임 중복 확인
  const handleCheckNickname = () => {
    if (isValidNickname) {
      checkAvailability('nickname', nickname, setIsNicknameExist, setIsNicknameUnique)
    } else {
      alert("닉네임 형식에 맞지 않습니다")
      updateIsAllChecked({ isNicknameUnique: false })
    }
  }

  //아이디 입력 핸들러
  const usernameHandleChange = (e) => {
    const value = e.target.value
    setUsername(value)
    const validUsername = validateUsername(value)
    setIsValidUsername(validUsername)
    setShowUsernameValidateMessage(value !== "" && !validUsername)
    updateIsAllChecked({ isValidUsername: validUsername, isUsernameUnique: false })
  }

  //비밀번호 입력 핸들러 및 유효성 검사
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

  //비밀번호 확인 핸들러
  const confirmPasswordHandleChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    const passwordMatched = validateConfirmPassword(value)
    setIsPasswordMatched(passwordMatched)

    // 비밀번호 확인이 입력되지 않은 경우 메시지 숨기기
    setShowConfirmPasswordValidateMessage(value !== "" && !passwordMatched)

    updateIsAllChecked({ isPasswordMatched: passwordMatched })
  }

  //닉네임 입력 핸들러
  const nicknameHandleChange = (e) => {
    const value = e.target.value
    setNickname(value)
    const validNickname = validateNickname(value)
    setIsValidNickname(validNickname)
    setShowNicknameValidateMessage(value !== "" && !validNickname)
    updateIsAllChecked({ isValidNickname: validNickname })
  }

  //전화번호 입력 핸들러
  const phoneNumberHandleChange = (e) => {
    const { value } = e.target
    const numericValue = value.replace(/\D/g, '') // 숫자만 추출
    const formattedValue = formatPhoneNumber(numericValue) // 전화번호 형식으로 변환
    setPhoneNumber(formattedValue)
    updateIsAllChecked()
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

  //이메일 입력 핸들러
  const emailHandleChange = (e) => {
    const value = e.target.value
    const validEmail = validateEmail(value)
    setEmail(value)
    setIsValidEmail(validEmail)
    setShowEmailValidateMessage(value !== "" && !validEmail)
    updateIsAllChecked({ isValidEmail: validEmail })
  }

  //인증코드 입력 핸들러
  const verificationCodeHandleChange = (e) => {
    setVerificationCode(e.target.value)
    updateIsAllChecked()
  }

  //인증코드 전송
  const sendVerificationCode = () => {
    axios.post('/api/v1/auth/phone/send-code', phoneNumber)
      .then(() => {
        setIsCodeSent(true)
        alert('인증 코드가 전송되었습니다.')
      })
      .catch(() => {
        alert('인증 코드 전송에 실패했습니다.')
      })
  }

  //휴대폰 번호 인증 확인
  const verifyPhoneNumber = () => {
    //인증 확인 api
    axios.post('/api/v1/auth/phone/verify-code', { phoneNumber, code: verificationCode })
      .then(() => {
        setIsVerified(true)
        updateIsAllChecked({ isVerified: true })
        alert('휴대폰 번호가 성공적으로 인증되었습니다.')
      })
      .catch(() => {
        alert('인증 코드가 잘못되었습니다.')
      })
  }

  //JWT토큰 처리 후 로그인 상태 저장
  const processToken = (token) => {
    if (token.startsWith("Bearer+")) {
      localStorage.setItem("token", token)
      const result = decodeToken(token.substring(7))

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
      axios.defaults.headers.common["Authorization"] = token
      navigate("/completedSignup", { state: { isAllChecked } })
    }
  }

  //회원가입 처리
  const handleSignUp = (e) => {
    e.preventDefault()
    if (!isAllChecked) {
      alert("모든 항목을 올바르게 입력해주세요.")
      return
    }
    
    axios.post(`/api/v1/auth/signup`, {
      username,
      password,
      confirmPassword,
      nickname,
      phoneNumber: getUnformattedPhoneNumber(),
      age,
      gender,
      email
    })
      .then((res) => {
        processToken(res.data)
      })
      .catch(() => {
        alert('회원가입에 실패하였습니다');
      })
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
            {showUsernameValidateMessage && (
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
              {showPasswordValidateMessage && (
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
              {showConfirmPasswordValidateMessage && (
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
            </div>
            {showNicknameValidateMessage && (
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

          {/* 나이 입력 필드 */}
          <div className="sm:col-span-3">
            <label htmlFor="age" className="block text-sm font-semibold leading-6 text-gray-900">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          {/* 성별 선택 필드 */}
          <div className="sm:col-span-3">
            <label htmlFor="gender" className="block text-sm font-semibold leading-6 text-gray-900">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          {/* 안내 메시지 추가 */}
          <div className="sm:col-span-6">
            <p style={{ marginTop: '-15px' }} className="text-sm text-gray-600">
              성별, 나이를 입력해야 모든 기능을 이용하실 수 있습니다.
            </p>
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
              {showEmailValidateMessage && (
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
            className={`block w-full rounded-md ${!isAllChecked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500'} px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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