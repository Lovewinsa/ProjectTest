import React, { useState, useEffect } from 'react';

function ExchangeInfo() {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [krwAmount, setKrwAmount] = useState(1000); // 기본값 1000 한화

    // 한화를 기준으로 환율 가져오기
    useEffect(() => {
        const fetchExchangeRates = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/fddfb68fc5e46faf142e2e15/latest/KRW`
                );
                const data = await response.json();
                setExchangeRates(data.conversion_rates);
            } catch (error) {
                setError('환율 정보를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    // 통화 코드와 화폐 이름 매핑
    const currencyNames = {
        USD: '미국 달러 (USD)',
        EUR: '유로 (EUR)',
        JPY: '일본 엔 (JPY)',
        GBP: '영국 파운드 (GBP)',
        CNY: '중국 위안 (CNY)',
        KRW: '대한민국 원 (KRW)',
        AUD: '호주 달러 (AUD)',
        CAD: '캐나다 달러 (CAD)',
        CHF: '스위스 프랑 (CHF)',
        HKD: '홍콩 달러 (HKD)',
        NZD: '뉴질랜드 달러 (NZD)',
        SGD: '싱가포르 달러 (SGD)',
        SEK: '스웨덴 크로나 (SEK)',
        NOK: '노르웨이 크로네 (NOK)',
        DKK: '덴마크 크로네 (DKK)',
        INR: '인도 루피 (INR)',
        BRL: '브라질 헤알 (BRL)',
        RUB: '러시아 루블 (RUB)',
        ZAR: '남아프리카 공화국 랜드 (ZAR)',
        TRY: '터키 리라 (TRY)',
        MXN: '멕시코 페소 (MXN)',
        PLN: '폴란드 즈워티 (PLN)',
        THB: '태국 바트 (THB)',
        MYR: '말레이시아 링깃 (MYR)',
        IDR: '인도네시아 루피아 (IDR)',
        PHP: '필리핀 페소 (PHP)',
        VND: '베트남 동 (VND)',
        ILS: '이스라엘 셰켈 (ILS)',
        EGP: '이집트 파운드 (EGP)',
        SAR: '사우디 리얄 (SAR)',
        AED: '아랍에미리트 디르함 (AED)',
        QAR: '카타르 리얄 (QAR)',
        KWD: '쿠웨이트 디나르 (KWD)'
    };

    const handleKrwAmountChange = (e) => {
        setKrwAmount(e.target.value); // 사용자가 입력한 값을 설정
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">환율 정보</h1>

            {/* 한화 입력칸 */}
            <div className="mb-4 text-center">
                <label htmlFor="krwAmount" className="mr-2">한국 돈 (KRW):</label>
                <input
                    id="krwAmount"
                    type="number"
                    value={krwAmount}
                    onChange={handleKrwAmountChange}
                    className="border px-2 py-1"
                />
            </div>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && exchangeRates && (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-gray-200 text-left">화폐</th>
                            <th className="py-2 px-4 border-b bg-gray-200 text-left">환율 (기준: {krwAmount} KRW)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(exchangeRates).map((currency) => (
                            <tr key={currency}>
                                <td className="py-2 px-4 border-b">{currencyNames[currency] || currency}</td>
                                <td className="py-2 px-4 border-b">
                                    {/* 입력한 KRW 값에 따라 각 화폐로 변환된 값 */}
                                    {Math.round((krwAmount * exchangeRates[currency]) * 100) / 100} {currency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ExchangeInfo;
