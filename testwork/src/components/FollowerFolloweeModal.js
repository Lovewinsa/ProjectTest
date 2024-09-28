import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function FollowerFolloweeModal({id, ff, onClose}) {

  const navigate = useNavigate();

  const [followerList, setFollowerList] = useState([]);
  const [followeeList, setFolloweeList] = useState([]);

  const [activeTab, setActiveTab] = useState(ff);

  useEffect(() => {

      // id 유저를 팔로우에 대한 리스트
      axios
        .get(`/api/v1/users/${id}/followInfos`)
        .then((res) => {
          setFollowerList(res.data.followerList);
          setFolloweeList(res.data.followeeList);
          console.log(res.data.followerList);
          console.log(res.data.followeeList);
        })
        .catch((error) => console.log(error));
  }, [id, ff]);

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const defaultProfile = (               
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className="h-12 w-12 bi bi-person-circle"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      fillRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
    />
  </svg>)

  return (
    <div
      id="large-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden top-1/4">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm font-medium text-center w-full">
            <ul className="flex justify-center space-x-4">
              <li>
                <p
                  onClick={() => handleActiveTab("followee")}
                  className={`cursor-pointer text-md font-bold p-2 border-b-2 ${
                    activeTab === "followee"
                      ? "text-blue-700 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  팔로잉
                </p>
              </li>

              <li>
                <p
                  onClick={() => handleActiveTab("follower")}
                  className={`cursor-pointer text-md font-bold p-2 border-b-2 ${
                    activeTab === "follower"
                      ? "text-blue-700 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  팔로워
                </p>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[75vh]">
          <ul className="divide-y divide-gray-100">

            {/* 팔로잉 */}
            {activeTab === "followee" &&
              followeeList.map((followee) => (
                <li
                key={followee.userId}
                className="flex justify-between gap-x-6 py-4 cursor-pointer"
                onClick={()=>{ navigate(`/users/${followee.id}/profile`)}}
                >
                  <div className="flex min-w-0 gap-x-4">
                    {
                      followee.profilePicture ? 
                      <img
                        alt="profilePicture"
                        src={followee.profilePicture}
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      />
                      :
                      defaultProfile
                    }
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {followee.nickname}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">나이/성별</p>
                  </div>
                </li>
              ))}

              {/* 팔로워 */}
              {activeTab === "follower" &&
                followerList.map((follower) => (
                  <li
                  key={follower.userId}
                  className="flex justify-between gap-x-6 py-4 cursor-pointer"
                  onClick={()=>{ navigate(`/users/${follower.userId}/profile`)}}
                  >
                    <div className="flex min-w-0 gap-x-4">
                    {
                      follower.profilePicture ? 
                      <img
                        alt="profilePicture"
                        src={follower.profilePicture}
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      />
                      :
                      defaultProfile
                    }

                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {follower.nickname}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">나이/성별</p>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FollowerFolloweeModal;
