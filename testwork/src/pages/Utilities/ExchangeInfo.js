import React, { useState, useEffect } from "react"
import { currencyNames } from "../../constants/mapping"

function ExchangeInfo() {
  const [exchangeRates, setExchangeRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [krwAmount, setKrwAmount] = useState(1000) // 기본값 1000 한화
  const [searchTerm, setSearchTerm] = useState("") // 검색어 상태

  // 한화를 기준으로 환율 가져오기
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_API_KEY}/latest/KRW`
        )
        const data = await response.json()

        setExchangeRates(data.conversion_rates)
      } catch (error) {
        setError("환율 정보를 가져오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRates()
  }, [])

  const handleKrwAmountChange = (e) => {
    setKrwAmount(e.target.value) // 사용자가 입력한 값을 설정
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value) // 사용자가 입력한 검색어를 설정
  }

  const filteredExchangeRates = Object.keys(exchangeRates || {}).filter((currency) =>
    currencyNames[currency] ? currencyNames[currency].toLowerCase().includes(searchTerm.toLowerCase()) : false
  )

  return (
    <div className="exchange-info-container mx-auto max-w-4xl p-4 bg-white shadow rounded-lg">
      <h1 className="exchange-info-title text-2xl font-bold mb-4">환율 정보</h1>

      {/* 한화 입력칸 */}
      <div className="exchange-info-input mb-4">
        <label htmlFor="krwAmount" className="exchange-info-label block text-sm font-medium text-gray-700">
          한국 돈 (KRW):
        </label>
        <input
          id="krwAmount"
          type="number"
          value={krwAmount}
          onChange={handleKrwAmountChange}
          className="exchange-info-input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* 검색어 입력칸 */}
      <div className="exchange-info-input mb-4">
        <label htmlFor="searchTerm" className="exchange-info-label block text-sm font-medium text-gray-700">
          검색어:
        </label>
        <input
          id="searchTerm"
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="나라이름 또는 화폐단위로 검색하세요."
          className="exchange-info-input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {loading && <p className="exchange-info-loading text-center text-gray-500">Loading...</p>}
      {error && <p className="exchange-info-error text-center text-red-500">{error}</p>}
      {!loading && exchangeRates && (
        <table className="exchange-info-table w-full mt-4">
          <thead>
            <tr>
              <th className="exchange-info-table-header text-left text-sm font-medium text-gray-500">화폐</th>
              <th className="exchange-info-table-header text-left text-sm font-medium text-gray-500">
                환율 (기준: {krwAmount} KRW)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExchangeRates.map((currency) => (
              <tr key={currency} className="border-b border-gray-200 mb-2">
                <td className="exchange-info-table-data text-sm text-gray-500 pr-4">
                  {currencyNames[currency] || currency}
                </td>
                <td className="exchange-info-table-data text-sm text-gray-500 pl-4">
                  {/* 입력한 KRW 값에 따라 각 화폐로 변환된 값 */}
                  {Math.round(krwAmount * exchangeRates[currency] * 100) / 100} {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ExchangeInfo
