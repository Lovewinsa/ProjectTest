import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function BlockModal({id, onClose}) {
  const navigate = useNavigate();

  const [blockedList, setBlockedList] = useState([]);

  useEffect(() => {
      axios
        .get(`/api/v1/users/${id}/block/followeesInfo`)
        .then((res) => {
          setBlockedList(res.data);
        })
        .catch((error) => console.log(error));
  }, [id]);

  return (
    <div
      id="large-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden top-1/4">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="text-sm font-medium text-center w-full">
            <div className="flex justify-center space-x-4">
                <p
                  className={`cursor-pointer text-md font-bold p-2 border-b-2 text-red-500`}
                >
                  차단 목록
                </p>
            </div>
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
            {
              blockedList.map((blocked) => (
                <li
                  key={blocked.userId}
                  className="flex justify-between gap-x-6 py-4"
                  onClick={()=>{ navigate(`/users/${blocked.userId}/profile`)}}
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      alt=""
                      src={blocked.profilePicture}
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {blocked.nickname}
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

export default BlockModal;
