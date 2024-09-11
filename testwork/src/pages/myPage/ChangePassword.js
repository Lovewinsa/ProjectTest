import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function PasswordUpdate(props) {
  const {id} = useParams()

  // const [currentPassword, setCurrentPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setNewConfirmPassword] = useState("");

  const [isValidNewPassword, setIsValidNewPassword] = useState(true);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);

  const [showValidationMessage, setShowValidationMessage] = useState(false)

  const [isAllChecked, setIsAllChecked] = useState(false)

  //유저의 모든 정보
  const [profile, setProfile] = useState({})

  const navigate = useNavigate();

  const validatePassword = (value) => {
    // 비밀번호 : 영어 대소문자, 숫자, 특수문자를 포함한 8~15자리
    setHasLowerCase(/[a-z]/.test(value));
    setHasUpperCase(/[A-Z]/.test(value));
    setHasNumber(/\d/.test(value));
    setHasSpecialChar(/[!@#$%^&*]/.test(value));
    setIsValidLength(value.length >= 8 && value.length <= 15);
  };
  //기존 비밀번호 핸들러
  const handleCurrentPassword = (e)=>{
    setProfile({
      ...profile,
      passowrd : e.target.value
    })

  }
  //새 비밀번호 핸들러
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setProfile({
      ...profile,
      newPassword : value
    })

    validatePassword(value);
    setShowValidationMessage(true)
  };

  //새 비밀번호 확인 핸들러
  const handleConfirmPasswordChange = (e) => {
    setProfile({
      ...profile,
      confirmPassword : e.target.value
    })  

  };

  //수정 버튼 핸들러
  const handleChangePassword = async () => {

    axios.put(`/api/v1/users/${id}/password`, profile)
    .then(res=>{
      console.log(res.data)
      alert("비밀번호 수정 완료")
      navigate(`/users/${id}/profile/edit`);
    })
    .catch(error=>console.log(error))
  };

  //처음 유저 정보를 불러와 상태값에 저장
  useEffect(()=>{
    axios.get(`/api/v1/users/${id}`)
    .then(res=>{
      setProfile(res.data)
    })
    .catch(error=>console.log(error))
  },[id])

  useEffect(() => {
    if (hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isValidLength) {
      setIsValidNewPassword(true)
      setShowValidationMessage(false)
    } else {
      setIsValidNewPassword(false)
    }
  }, [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isValidLength])

  useEffect(() => {
    setIsPasswordMatched(profile.newPassword === profile.confirmPassword);
  }, [profile.newPassword, profile.confirmPassword])

  useEffect(() => {
    if (isValidNewPassword && isPasswordMatched) {
      setIsAllChecked(true)
    } else {
      setIsAllChecked(false)
    }
  }, [isValidNewPassword, isPasswordMatched])


  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          비밀번호 변경
        </h2>
      </div>

      <form className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-6 sm:gap-x-4">

          <div className="sm:col-span-6">
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              현재 비밀번호:
            </label>
            <input
              type="password"
              onChange={handleCurrentPassword}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              새 비밀번호:
            </label>
            <div className="mt-2.5">
              <input
                type="password"
                onChange={handleNewPasswordChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
                {showValidationMessage && !isValidNewPassword && (
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
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              새 비밀번호 확인:
              </label>
              <div className="mt-2.5">
              <input
                type="password"
                onChange={handleConfirmPasswordChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
              {!isPasswordMatched && (
                <p className="mt-2 text-sm text-red-600">
                  새 비밀번호와 확인 비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={handleChangePassword}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={!isAllChecked}
            >변경</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PasswordUpdate;
