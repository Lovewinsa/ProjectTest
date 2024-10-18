import React, { useState, useEffect } from "react"
import axios from "axios"

const axiosInstanceForSafetyInfo = axios.create({
  baseURL: "https://www.travel-advisory.info/api",
})

function TripSafetyInfo() {
  const [safetyInfo, setSafetyInfo] = useState([])
  const [filteredInfo, setFilteredInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSafetyInfo = async () => {
      try {
        const response = await axiosInstanceForSafetyInfo.get("")
        const countries = response.data.data
        const safetyArray = Object.values(countries)

        setSafetyInfo(safetyArray)
        setFilteredInfo(safetyArray)
      } catch (err) {
        setError("여행 안전 정보를 가져오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchSafetyInfo()
  }, [])

  useEffect(() => {
    const filtered = safetyInfo.filter((info) => info.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredInfo(filtered)
  }, [searchTerm, safetyInfo])

  if (loading) {
    return <div className="text-center text-lg">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">여행 안전 정보</h1>
      <input
        type="text"
        placeholder="국가 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <ul className="space-y-4">
        {filteredInfo.length > 0 ? (
          filteredInfo.map((info, index) => (
            <li key={index} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <strong className="text-lg">{info.name}:</strong>
              <p className="text-gray-700">{info.advisory.message ? info.advisory.message : "안전 정보가 없습니다."}</p>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  )
}

export default TripSafetyInfo
