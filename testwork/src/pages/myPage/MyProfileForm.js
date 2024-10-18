import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import LoadingAnimation from "../../components/LoadingAnimation";

function MyProfileForm(props) {
  //로딩 상태 추가
  const [loading, setLoading] = useState(false);

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
    ratings: 1300,
    socialLinks: [],
  });

  const tictokRef = useRef();
  const instagramRef = useRef();

  const { id } = useParams();

  // 닉네임 중복검사 관련
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  const [initialNickname, setInitialNickname] = useState();

  // useEffect
  useEffect(() => {
    // 로딩 애니메이션을 0.5초 동안만 표시
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);

    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => {
        if (!userId || userId !== res.data.userProfileInfo.userId) {
          alert("잘못된 접근입니다.");
          navigate(`/`);
        }
        console.log(res.data);
        console.log(res.data.userProfileInfo);
        setProfile(res.data.userProfileInfo);

        const socialLinks = res.data.userProfileInfo.socialLinks || [];
        socialLinks.forEach((link) => {
          const [platform, value] = link.split("+");
          if (platform === "tictok") {
            tictokRef.current.value = value.replace("tictok+", "");
          } else if (platform === "instagram") {
            instagramRef.current.value = value.replace("instagram+", "");
          }
        });

        setInitialNickname(res.data.userProfileInfo.nickname); // 로딩된 닉네임 초기값 저장
        if (res.data.userProfileInfo.profilePicture) {
          setImageData(res.data.userProfileInfo.profilePicture);
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
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
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

    console.log(tictokRef.current.value);
    console.log(instagramRef);
    const socialLinks = [`tictok+${tictokRef.current.value}`, `instagram+${instagramRef.current.value}`];

    const formData = new FormData();
    formData.append("id", profile.id);
    formData.append("userId", profile.userId);
    formData.append("age", profile.age || "");
    formData.append("gender", profile.gender || "");
    formData.append("nickname", profile.nickname);
    formData.append("socialLinks", socialLinks || []);
    formData.append("profileMessage", profile.profileMessage || "");
    formData.append("profilePicture", profile.profilePicture || "");

    formData.append("curLocation", profile.curLocation || "");
    formData.append("ratings", profile.ratings);
    formData.append("lastLogin", profile.lastLogin || "");

    console.log(formData);

    //current.files[0] 의 값이 null 로 전달되어 에러가 발생
    //input type="file" 에 파일이 존재하면 multipart type의 데이터 append
    if (inputImage.current.files && inputImage.current.files.length > 0) {
      formData.append("profileImgForUpload", inputImage.current.files[0]);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    axios
      .put(`/api/v1/users/${id}/profile-info`, formData, {
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

  // form 에서 전송되는 데이터 : profilePicture, profileMessage ,(email),(phoneNumber)
  return (
    <div className="container mx-auto p-4 max-w-[900px] shadow-md rounded-lg">
      {/* 로딩 애니메이션 */}
      {loading && <LoadingAnimation />}
      <div>
        <button type="button" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
          <Link to={`/users/${id}/profile`}>돌아가기</Link>
        </button>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Profile Update Form</h1>
      </div>
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
                className="w-40 h-40 rounded-full mb-4 shadow-lg"
                alt="profilePicture"
              />
            ) : (
              <img
                onClick={() => inputImage.current.click()}
                className="bi bi-person-circle w-40 h-40"
                src={`${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`}
                alt="default profile img"
              />
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
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
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
                className="block w-full p-2 border border-gray-300 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600">
                비밀번호 변경
              </button>
            </div>
          </div>

          {/* 개인 정보 */}
          <div className="flex space-x-4">
            <div className="mb-3 flex-1">
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                age
              </label>
              <input
                type="text"
                name="age"
                value={profile.age || ""}
                className="block w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 flex-1">
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                gender
              </label>
              <select
                value={profile.gender || ""}
                onChange={handleChange}
                className="block w-full p-2 border border-gray-300 rounded-md"
                name="gender"
                id="gender">
                <option value=""></option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
          </div>

          {/* 소셜 링크 */}
          <div className="flex space-x-4">
            <div className="mb-3 flex-1">
              <img src="/img/socialLinks/tictok.svg" className="w-6 mb-3" alt="tictok.svg" />
              <input
                ref={tictokRef}
                type="text"
                name="socialLinks.tictok"
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-3 flex-1">
              <img src="/img/socialLinks/instagram.svg" className="mb-3" alt="instagram.svg" />
              <input
                ref={instagramRef}
                type="text"
                name="socialLinks.instagram"
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 프로필 메세지 */}
          <div className="mb-3">
            <label htmlFor="profileMessage" className="block text-sm font-medium mb-1 overflow-y-auto">
              Profile Message
            </label>
            <textarea
              onChange={handleChange}
              name="profileMessage"
              className="fborder-2 border-gray-400 rounded-md p-2 min-h-40 max-h-40 overflow-y-auto w-full"
              rows="5"
              value={profile.profileMessage || ""}
            />
          </div>

          {/* save 버튼 */}
          <div>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyProfileForm;
