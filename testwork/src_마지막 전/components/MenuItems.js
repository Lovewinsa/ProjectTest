import React from "react"
import { useNavigate } from "react-router"
import { menuItems } from "../constants/mapping"

function MenuItems() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center">
      <div className="max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center p-4 rounded-lg shadow-2xl">
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center transition-transform transform hover:scale-105">
            <div className="rounded-full overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={`${process.env.PUBLIC_URL}/img/menuIcons/${item.imageSrc}`}
                alt={`menu item ${item.name}`}
                className="cursor-pointer w-full h-full object-cover"
                onClick={() => navigate(item.linkSrc)}
              />
            </div>
            <span className="mt-2 text-lg font-semibold text-gray-800">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuItems
