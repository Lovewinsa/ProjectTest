import React, { useEffect, useState } from 'react';

function TravelCostCalculator() {
    const [amountInKRW, setAmountInKRW] = useState(0); // 원화 입력 값
    const [foreignCurrencyAmount, setForeignCurrencyAmount] = useState(0); // 외화 입력 값
    const [currencyCode, setCurrencyCode] = useState('JPY'); 
    const [exchangeRate, setExchangeRate] = useState(1); 
    const [currentRate, setCurrentRate] = useState(0); 

    const totalCostInForeignCurrency = (amountInKRW / exchangeRate).toFixed(1); // 소수점 첫째 자리까지 표시 (원화 -> 외화)
    const totalCostInKRW = (foreignCurrencyAmount * exchangeRate).toFixed(1); // 소수점 첫째 자리까지 표시 (외화 -> 원화)

    const fetchExchangeRate = async (currencyCode) => {
        const EXCHANGE_API_KEY = 'fddfb68fc5e46faf142e2e15'; 
        const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${currencyCode}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const rate = data.conversion_rates['KRW']; // 선택된 통화에서 원화로 환율
            setExchangeRate(rate);
            setCurrentRate(rate.toFixed(1)); // 소수점 첫째 자리까지
        } catch (error) {
            console.error('환율 정보를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (currencyCode) {
            fetchExchangeRate(currencyCode);
        }
    }, [currencyCode]);

    return (
        <div>
            <h1>Travel Cost Calculator</h1>
            
            {/* 원화 -> 외화 변환 */}
            <h2>원화를 외화로 변환</h2>
            <label>
                원화 금액:
                <input 
                    type="number" 
                    value={amountInKRW}
                    onChange={(e) => setAmountInKRW(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                통화 선택:
                <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
                    <option value="JPY">JPY (일본 엔)</option>
                    <option value="USD">USD (미국 달러)</option>
                    <option value="EUR">EUR (유로)</option>
                    <option value="GBP">GBP (영국 파운드)</option>
                    <option value="KRW">KRW (한국 원)</option>
                </select>
            </label>
            <br />
            <h3>현재 환율: {currentRate} KRW</h3>
            <h3>원화를 외화로 변환: {totalCostInForeignCurrency} {currencyCode}</h3>
            
            <hr />

            {/* 외화 -> 원화 변환 */}
            <h2>외화를 원화로 변환</h2>
            <label>
                외화 금액:
                <input 
                    type="number" 
                    value={foreignCurrencyAmount}
                    onChange={(e) => setForeignCurrencyAmount(Number(e.target.value))}
                />
            </label>
            <br />
            <h3>외화를 원화로 변환: {totalCostInKRW} KRW</h3>
        </div>
    );
}

export default TravelCostCalculator;
