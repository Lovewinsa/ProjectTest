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
    if (activeTab === "follower") {
      axios
        .get(`/api/v1/users/${id}/followersInfo`)
        .then((res) => {
          setFollowerList(res.data);
        })
        .catch((error) => console.log(error));
    } else if (activeTab === "followee") {
      axios
        .get(`/api/v1/users/${id}/follow/followeesInfo`)
        .then((res) => {
          setFolloweeList(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, [activeTab, id, ff]);

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

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
            {activeTab === "follower" &&
              followerList.map((follower) => (
                <li
                  key={follower.userId}
                  className="flex justify-between gap-x-6 py-4"
                  onClick={()=>{ navigate(`/users/${follower.userId}/profile`)}}
                  >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      alt=""
                      src={follower.profilePicture}
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                      />
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

            {activeTab === "followee" &&
              followeeList.map((followee) => (
                <li
                key={followee.userId}
                className="flex justify-between gap-x-6 py-4"
                onClick={()=>{ navigate(`/users/${followee.userId}/profile`)}}
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      alt=""
                      src={followee.profilePicture}
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    />
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
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FollowerFolloweeModal;
