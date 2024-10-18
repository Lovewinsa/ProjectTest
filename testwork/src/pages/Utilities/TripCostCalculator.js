import React, { useEffect, useState } from "react"
import { currencyNames } from "../../constants/mapping"

function TripCostCalculator() {
  const [days, setDays] = useState([1, 2, 3, 4])
  const [expenses, setExpenses] = useState({
    1: { food: 0, accommodation: 0, miscellaneous: 0, additional: [] },
    2: { food: 0, accommodation: 0, miscellaneous: 0, additional: [] },
    3: { food: 0, accommodation: 0, miscellaneous: 0, additional: [] },
    4: { food: 0, accommodation: 0, miscellaneous: 0, additional: [] },
  })

  const [exchangeRates, setExchangeRates] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState("KRW")
  const [searchTerm, setSearchTerm] = useState("")
  const [curRate, setCurRate] = useState(0)
  const [showCurrencyList, setShowCurrencyList] = useState(false) // 리스트 표시 상태 추가

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_API_KEY}/latest/KRW`
        )
        const data = await response.json()

        setExchangeRates(data.conversion_rates)
      } catch (error) {
        setError("환율 정보를 가져오는 데 실패했습니다.")
      }
    }

    fetchExchangeRates()
  }, [])

  const totalFoodExpenses = Object.values(expenses).reduce((acc, curr) => acc + curr.food, 0)
  const totalAccommodationExpenses = Object.values(expenses).reduce((acc, curr) => acc + curr.accommodation, 0)
  const totalMiscellaneousExpenses = Object.values(expenses).reduce((acc, curr) => acc + curr.miscellaneous, 0)

  const additionalCosts = {}
  Object.values(expenses).forEach((day) => {
    day.additional.forEach((item) => {
      if (item.label) {
        additionalCosts[item.label] = (additionalCosts[item.label] || 0) + parseInt(item.cost, 10) || 0
      }
    })
  })

  const totalExpenses =
    totalFoodExpenses +
    totalAccommodationExpenses +
    totalMiscellaneousExpenses +
    Object.values(additionalCosts).reduce((acc, cost) => acc + cost, 0)

  useEffect(() => {
    if (exchangeRates) {
      const rate = exchangeRates[selectedCurrency] || 1
      setCurRate(rate)
    }
  }, [exchangeRates, selectedCurrency, totalExpenses])

  const addDay = () => {
    const newDay = days.length + 1
    setDays([...days, newDay])
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [newDay]: { food: 0, accommodation: 0, miscellaneous: 0, additional: [] },
    }))
  }

  const addItem = (day) => {
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [day]: {
        ...prevExpenses[day],
        additional: [...prevExpenses[day].additional, { label: "", cost: 0 }],
      },
    }))
  }

  const handleAdditionalChange = (day, index, field, value) => {
    setExpenses((prevExpenses) => {
      const updatedAdditional = [...prevExpenses[day].additional]
      updatedAdditional[index] = { ...updatedAdditional[index], [field]: value }
      return {
        ...prevExpenses,
        [day]: { ...prevExpenses[day], additional: updatedAdditional },
      }
    })
  }

  const filteredCurrencies = searchTerm
    ? Object.entries(currencyNames).filter(([key, value]) => value.includes(searchTerm))
    : []

  const handleCurrencyClick = (currency) => {
    setSearchTerm(currency)
    setSelectedCurrency(currency) // 선택된 통화 업데이트
    setShowCurrencyList(false) // 클릭 시 리스트 숨기기
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setShowCurrencyList(e.target.value.length > 0) // 입력 시 리스트 표시
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCurrencies.length === 1) {
      handleCurrencyClick(filteredCurrencies[0][0]) // 단일 항목 클릭
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">여행 경비 계산기</h1>
      {error && <p className="exchange-info-error text-center text-red-500">{error}</p>}

      <div className="mb-4 relative flex flex-col">
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mt-3">
          나라 이름 (통화 이름):
        </label>
        <div className="flex items-center">
          <input
            id="currency"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="mt-1 block w-1/2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out"
            placeholder="통화 이름을 입력하세요..."
          />
          <div className="flex justify-end w-full">
            <button
              onClick={addDay}
              className="ml-2 w-32 py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-tripDuoGreen transition duration-300">
              날짜 추가
            </button>
          </div>
        </div>
      </div>
      <ul
        className={`absolute w-1/5 bg-white border border-gray-300 rounded-md shadow-lg z-10 ${
          showCurrencyList && filteredCurrencies.length ? "block" : "hidden"
        }`} style={{ marginTop: '-1rem' }}>
        {filteredCurrencies.map(([key, value]) => (
          <li
            key={key}
            className="text-gray-700 cursor-pointer hover:bg-gray-100 p-2 transition duration-150 ease-in-out"
            onClick={() => handleCurrencyClick(key)}>
            {value}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-10">
        {days.map((day, index) => (
          <div
            key={day}
            className={`w-full lg:w-1/4 md:w-1/4 sm:w-1/2 xs:w-1/2 mb-2 bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300 ${
              index % 4 === 0 ? "clear-both" : ""
            }`}>
            <h2 className="text-lg font-bold mb-2 text-tripDuoGreen">Day {day}</h2>
            <div className="mb-2">
              <label htmlFor={`food-${day}`} className="block text-sm font-medium text-gray-700">
                식비:
              </label>
              <input
                id={`food-${day}`}
                type="text"
                pattern="[0-9]*"
                value={expenses[day].food}
                onChange={(e) =>
                  setExpenses((prevExpenses) => ({
                    ...prevExpenses,
                    [day]: { ...prevExpenses[day], food: parseInt(e.target.value, 10) || 0 },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-2">
              <label htmlFor={`accommodation-${day}`} className="block text-sm font-medium text-gray-700">
                숙박비:
              </label>
              <input
                id={`accommodation-${day}`}
                type="text"
                pattern="[0-9]*"
                value={expenses[day].accommodation}
                onChange={(e) =>
                  setExpenses((prevExpenses) => ({
                    ...prevExpenses,
                    [day]: { ...prevExpenses[day], accommodation: parseInt(e.target.value, 10) || 0 },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-2">
              <label htmlFor={`miscellaneous-${day}`} className="block text-sm font-medium text-gray-700">
                기타 부대비용:
              </label>
              <input
                id={`miscellaneous-${day}`}
                type="text"
                pattern="[0-9]*"
                value={expenses[day].miscellaneous}
                onChange={(e) =>
                  setExpenses((prevExpenses) => ({
                    ...prevExpenses,
                    [day]: { ...prevExpenses[day], miscellaneous: parseInt(e.target.value, 10) || 0 },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {expenses[day].additional.map((item, index) => (
              <div key={index} className="mb-2">
                <label className="block text-sm font-medium text-gray-700">추가 항목:</label>
                <input
                  type="text"
                  placeholder="항목명"
                  value={item.label}
                  onChange={(e) => handleAdditionalChange(day, index, "label", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="비용"
                  pattern="[0-9]*"
                  value={item.cost}
                  onChange={(e) => handleAdditionalChange(day, index, "cost", parseInt(e.target.value, 10) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            ))}
            <div className="mt-4">
              <button
                onClick={() => addItem(day)}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-tripDuoGreen focus:outline-none focus:ring-2 focus:ring-blue-400">
                항목추가
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-2 bg-gray-100 p-4 rounded-lg shadow-md border border-tripDuoGreen">
        <h2 className="text-lg font-bold mb-2 text-tripDuoGreen">총 경비</h2>
        <p className="text-lg font-bold mb-2">
          식비: {totalFoodExpenses.toLocaleString()} 원 ::{" "}
          {(Math.round(totalFoodExpenses * curRate * 100) / 100).toLocaleString()} {selectedCurrency}
        </p>
        <p className="text-lg font-bold mb-2">
          숙박비: {totalAccommodationExpenses.toLocaleString()} 원 ::{" "}
          {(Math.round(totalAccommodationExpenses * curRate * 100) / 100).toLocaleString()} {selectedCurrency}
        </p>
        <p className="text-lg font-bold mb-2">
          기타 부대비용: {totalMiscellaneousExpenses.toLocaleString()} 원 ::{" "}
          {(Math.round(totalMiscellaneousExpenses * curRate * 100) / 100).toLocaleString()} {selectedCurrency}
        </p>

        {Object.entries(additionalCosts).map(([label, cost]) => (
          <p key={label} className="text-lg font-bold mb-2">
            {label}: {cost.toLocaleString()} 원 :: {(Math.round(cost * curRate * 100) / 100).toLocaleString()}{" "}
            {selectedCurrency}
          </p>
        ))}

        <p className="text-lg font-bold mb-2">
          전체 비용 합계: {totalExpenses.toLocaleString()} 원 ::{" "}
          {(Math.round(totalExpenses * curRate * 100) / 100).toLocaleString()} {selectedCurrency}
        </p>
      </div>
    </div>
  )
}

export default TripCostCalculator
