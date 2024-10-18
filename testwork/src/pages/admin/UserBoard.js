import axios from "axios"
import { useEffect, useState } from "react"

function UserBoard() {
  const [userList, setUserList] = useState([])
  const [cdnUrl, setCdnUrl] = useState("")
  const [selectedUser, setSelectedUser] = useState(null) // 선택된 유저 상태 추가
  const [isModalOpen, setModalOpen] = useState(false) // 모달 열기 상태 추가

  useEffect(() => {
    axios
      .get("/api/v1/users/profile-info")
      .then((res) => {
        setUserList(res.data.userList)
        setCdnUrl(res.data.cloudfrontUrl)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleUserClick = (user) => {
    setSelectedUser(user) // 클릭한 유저 정보 설정
    setModalOpen(true) // 모달 열기
  }

  const handleCloseModal = () => {
    setModalOpen(false) // 모달 닫기
    setSelectedUser(null) // 선택된 유저 초기화
  }

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal-background")) {
      handleCloseModal()
    }
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">nickname</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              profilePicture
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ratings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              lastLogin
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userList.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleUserClick(user)}>
              <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={
                    user.profilePicture
                      ? cdnUrl + user.profilePicture
                      : `${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.ratings}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-background"
          onClick={handleOutsideClick}>
          <div
            className="bg-white rounded-lg p-6 w-2/3 md:w-1/2 lg:w-1/3 flex flex-col items-center space-y-6"
            onClick={(e) => e.stopPropagation()}>
            {/* 프로필 상단 부분 */}
            <div className="flex items-center space-x-6 w-full">
              <img
                src={
                  selectedUser.profilePicture
                    ? cdnUrl + selectedUser.profilePicture
                    : `${process.env.PUBLIC_URL}/img/defaultImages/defaultProfilePicture.svg`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div className="flex flex-col space-y-2 w-full">
                <h2 className="text-2xl font-bold">{selectedUser.user.username}</h2>
                <div className="flex space-x-4">
                  <p>
                    <strong>Nickname:</strong> {selectedUser.nickname}
                  </p>
                  <p>
                    <strong>Age:</strong> {selectedUser.age}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <p>
                    <strong>Gender:</strong> {selectedUser.gender}
                  </p>
                  <p>
                    <strong>Ratings:</strong> {selectedUser.ratings}
                  </p>
                </div>
                <p>
                  <strong>Account Status:</strong> {selectedUser.user.accountStatus}
                </p>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="flex flex-col space-y-2 w-full">
              <p>
                <strong>Last Login:</strong> {selectedUser.lastLogin}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.user.role}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(selectedUser.user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Social Links:</strong> {selectedUser.socialLinks ? selectedUser.socialLinks.join(", ") : "없음"}
              </p>
            </div>

            {/* 닫기 버튼 */}
            <div className="flex justify-end w-full">
              <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserBoard
