import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

function MyProfileForm(props) {
  const userId = useSelector((state) => state.userData.id, shallowEqual); // 접속된 사용자의 id
  const username = useSelector((state) => state.userData.username, shallowEqual); // 접속된 사용자의 username

  const dispatch = useDispatch();

  const profileImage = useRef();
  const inputImage = useRef();
  const inputNickname = useRef();

  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);

  const [profile, setProfile] = useState({
    id: "",
    userId: "",
    nickname: "",
    age: "",
    gender: "",
    profilePicture: "",
    profileMessage: "",
    socialLinks: {
      github: "",
      instagram: "",
    },
  });

  const { id } = useParams();

  // 닉네임 중복검사 관련
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  const [initialNickname, setInitialNickname] = useState();

  // useEffect
  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => {
        if (!userId || userId !== res.data.userId) {
          alert("잘못된 접근입니다.");
          navigate(`/`);
        }
        console.log(res.data);
        setProfile(res.data);

        setInitialNickname(res.data.nickname); // 로딩된 닉네임 초기값 저장
        if (res.data.profilePicture) {
          setImageData(res.data.profilePicture);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  //비밀번호 변경 페이지로 이동
  const toChangePassword = () => {
    navigate(`/auth/${id}/changePassword`);
  };

  // 이벤트 관리부
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "nickname") {
      if (e.target.value === initialNickname) {
        //처음 닉네임과 같은걸 입력했다면
        setIsDuplicate(null); // 검사 결과 리셋
        setIsNicknameChanged(false);
      } else {
        setIsNicknameChanged(true);
      }
    }
  };

  // *** 중복 검사 핸들러
  const handleCheckDuplicate = () => {
    axios
      .post(`/api/v1/users/check/nickname`, profile.nickname, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsDuplicate(res.data);
      })
      .catch((error) => console.log(error));
  };

  // *** 이미지 input ***
  const handleInputImage = () => {
    const files = inputImage.current.files;
    if (files.length > 0) {
      const file = files[0];
      const reg = /image/;

      if (!reg.test(file.type)) {
        alert("이미지 파일이 아닙니다");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const data = e.target.result;
        // file.dataUrl = data

        setImageData(data);
      };
    }
  };

  // *** SUBMIT 이벤트 ***
  const handleSave = () => {
    // 닉네임이 수정되고 && 중복체크가 성공하지 않았다면
    console.log(isNicknameChanged);
    console.log(isDuplicate);

    if (isNicknameChanged && (isDuplicate === true || isDuplicate === null)) {
      alert("사용 가능한 닉네임인지 확인해주세요");
      //포커스 이동 !! 좀 더 위로 올라가게 수정하기
      inputNickname.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const formData = new FormData();
    formData.append("id", profile.id);
    formData.append("userId", profile.userId);
    formData.append("age", profile.age);
    formData.append("gender", profile.gender);
    formData.append("nickname", profile.nickname);
    formData.append("socialLinks", profile.socialLinks);
    formData.append("profileMessage", profile.profileMessage);
    formData.append("profilePicture", profile.profilePicture);

    formData.append("curLocation", profile.curLocation);
    formData.append("ratings", profile.ratings);
    formData.append("lastLogin", profile.lastLogin);

    //current.files[0] 의 값이 null 로 전달되어 에러가 발생
    //input type="file" 에 파일이 존재하면 multipart type의 데이터 append
    if (inputImage.current.files && inputImage.current.files.length > 0) {
      formData.append("profileImgForUpload", inputImage.current.files[0]);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    axios
      .put(`/api/v1/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const userData = {
          id: userId,
          username,
          nickname: res.data.nickname,
          profilePicture: res.data.profilePicture,
        };

        // jwt token 갱신
        localStorage.setItem("token", res.data.token);
        dispatch({ type: "UPDATE_USER", payload: { userData } });

        alert("저장되었습니다.");
        navigate(`/users/${id}/profile`);
      })
      .catch((error) => console.log(error));
  };

  const instagramIcon = (
    <svg
      className="fill-current transition duration-700 ease-in-out text-gray-700 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Instagram</title>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );

  const gitHubIcon = (
    <svg
      className="fill-current transition duration-700 ease-in-out text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-black"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Github</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );

  // form 에서 전송되는 데이터 : profilePicture, profileMessage ,(email),(phoneNumber)
  return (
    <>
      <h3>Profile Update Form</h3>
      <button type="button" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
        <Link to={`/users/${id}/profile`}>돌아가기</Link>
      </button>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        {/* 수정 폼 */}
        <form className="space-y-4">
          {/* 프로필 이미지 */}
          <div className="m-3 flex justify-center">
            <input
              onChange={handleInputImage}
              ref={inputImage}
              className="hidden"
              type="file"
              name="profilePicture"
              accept="image/"
              multiple
            />

            {imageData ? (
              <img
                ref={profileImage}
                onClick={() => inputImage.current.click()}
                src={imageData}
                className="w-[150px] h-[150px] rounded-full mb-4"
                alt="profilePicture"
              />
            ) : (
              <svg
                onClick={() => inputImage.current.click()}
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                fill="currentColor"
                className="bi bi-person-circle mb-4"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium mb-1">
              Nickname
            </label>
            <div className="flex space-x-4">
              <input
                ref={inputNickname}
                onChange={handleChange}
                type="text"
                name="nickname"
                value={profile.nickname}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              />

              <button
                type="button"
                onClick={handleCheckDuplicate}
                disabled={!isNicknameChanged} //기본값 true(비활성화됨) 수정되면 활성화(false)
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
              >
                중복 검사
              </button>
            </div>
            <div>
              {isDuplicate === null && null}
              {isDuplicate === true && <div className="text-red-500">이미 사용중인 닉네임입니다.</div>}
              {isDuplicate === false && <div className="text-green-500">사용 가능한 닉네임입니다.</div>}
            </div>
          </div>

          {/* 로그인 정보 */}
          <div className="flex space-x-4 bg-gray-200 rounded">
            <div className="mb-3 flex-1">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                ID
              </label>
              <input
                type="text"
                name="username"
                value={username}
                className="block w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
            <div className="mb-3 flex-1">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <button
                onClick={toChangePassword}
                className="block w-full p-2 border border-gray-300 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600"
              >
                비밀번호 변경
              </button>
            </div>
          </div>

          {/* 개인 정보 */}
          <div className="flex space-x-4 bg-gray-200 rounded">
            <div className="mb-3 flex-1">
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                age
              </label>
              <input
                type="text"
                name="age"
                value={profile.age}
                className="block w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
            <div className="mb-3 flex-1">
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                gender
              </label>
              <input
                type="text"
                name="gender"
                value={profile.gender}
                className="block w-full p-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
          </div>

          {/* 소셜 링크 */}
          <div className="flex space-x-4">
            <div className="mb-3 flex-1">
              <label htmlFor="github" className="block text-sm font-medium mb-1">
                {gitHubIcon}
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="github"
                value={profile.socialLinks}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-3 flex-1">
              <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                {instagramIcon}
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="instagram"
                value={profile.socialLinks}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 프로필 메세지 */}
          <div className="mb-3">
            <label htmlFor="profileMessage" className="block text-sm font-medium mb-1">
              Profile Message
            </label>
            <textarea
              onChange={handleChange}
              name="profileMessage"
              className="form-control w-full h-auto resize-none overflow-y-auto"
              rows="5"
              defaultValue={profile.profileMessage}
            />
          </div>

          {/* save 버튼 */}
          <div>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default MyProfileForm;
