import React, { useState, useEffect } from 'react';

function ExchangeInfo() {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h1>환율 정보 (기준: 한화)</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && exchangeRates && (
                <table border="1">
                    <thead>
                        <tr>
                            <th>화폐</th>
                            <th>환율 (기준: KRW)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(exchangeRates).map((currency) => (
                            <tr key={currency}>
                                <td>{currencyNames[currency] || currency}</td>
                                <td>{Math.round(exchangeRates[currency] * 100) / 100}</td> {/* 소수점 첫 번째 자리까지만 */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ExchangeInfo;
