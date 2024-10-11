import React, { useEffect, useState } from "react"

function TravelCostCalculator() {
  const [amountInKRW, setAmountInKRW] = useState(0) // 원화 입력 값
  const [foreignCurrencyAmount, setForeignCurrencyAmount] = useState(0) // 외화 입력 값
  const [currencyCode, setCurrencyCode] = useState("JPY")
  const [exchangeRate, setExchangeRate] = useState(1)
  const [currentRate, setCurrentRate] = useState(0)

  const totalCostInForeignCurrency = (amountInKRW / exchangeRate).toFixed(1) // 소수점 첫째 자리까지 표시 (원화 -> 외화)
  const totalCostInKRW = (foreignCurrencyAmount * exchangeRate).toFixed(1) // 소수점 첫째 자리까지 표시 (외화 -> 원화)

  const fetchExchangeRate = async (currencyCode) => {
    const EXCHANGE_API_KEY = "fddfb68fc5e46faf142e2e15"
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${currencyCode}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const rate = data.conversion_rates["KRW"] // 선택된 통화에서 원화로 환율
      setExchangeRate(rate)
      setCurrentRate(rate.toFixed(1)) // 소수점 첫째 자리까지
    } catch (error) {
      console.error("환율 정보를 가져오는 중 오류 발생:", error)
    }
  }

  useEffect(() => {
    if (currencyCode) {
      fetchExchangeRate(currencyCode)
    }
  }, [currencyCode])

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">여행 비용 계산기</h1>

      {/* 원화 -> 외화 변환 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">원화를 외화로 변환</h2>
        <label className="block mb-2">
          원화 금액:
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={amountInKRW}
            onChange={(e) => setAmountInKRW(Number(e.target.value))}
          />
        </label>
        <label className="block mb-2">
          통화 선택:
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded">
            <option value="JPY">JPY (일본 엔)</option>
            <option value="USD">USD (미국 달러)</option>
            <option value="EUR">EUR (유로)</option>
            <option value="GBP">GBP (영국 파운드)</option>
            <option value="KRW">KRW (한국 원)</option>
          </select>
        </label>
        <h3 className="mt-2 text-lg">현재 환율: {currentRate} KRW</h3>
        <h3 className="mt-2 text-lg">
          원화를 외화로 변환: {totalCostInForeignCurrency} {currencyCode}
        </h3>
      </div>

      <hr className="my-4" />

      {/* 외화 -> 원화 변환 */}
      <div>
        <h2 className="text-xl font-semibold">외화를 원화로 변환</h2>
        <label className="block mb-2">
          외화 금액:
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={foreignCurrencyAmount}
            onChange={(e) => setForeignCurrencyAmount(Number(e.target.value))}
          />
        </label>
        <h3 className="mt-2 text-lg">외화를 원화로 변환: {totalCostInKRW} KRW</h3>
      </div>
    </div>
  )
}

export default TravelCostCalculator
