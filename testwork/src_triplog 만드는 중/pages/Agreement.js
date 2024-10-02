import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TermServiceModal from '../components/TermServiceModal';
import TermPrivacyModal from '../components/TermPrivacyModal';

function Agreement() {
    const [allAgreed, setAllAgreed] = useState(false)
    const [agreements, setAgreements] = useState({
        termsService: false,
        termsPrivacy: false,
        essential: false,
        selective: false
    })
    const { selective, ...rest } = agreements
    const [text, textarea] = useState("약관내용...")
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(true);
    const essentialChecked = Object.values(rest).every((value) => value === true)

    const [isTermServiceModalOpen, setTermServiceModalOpen] = useState(false)
    const openTermServiceModal = (e) => {
        e.preventDefault()
        setTermServiceModalOpen(true);
    }
    const closeTermServiceModal = () => setTermServiceModalOpen(false)

    const [isTermPrivacyModalOpen, setTermPrivacyModalOpen] = useState(false)
    const openTermPrivacyModal = (e) => {
        e.preventDefault()
        setTermPrivacyModalOpen(true)
    }
    const closeTermPrivacyModal = () => setTermPrivacyModalOpen(false)

    useEffect(() => {
        setIsDisabled(!essentialChecked)
    }, [essentialChecked])

    const handleAgreementChange = (e) => {
        const { name, checked } = e.target
        setAgreements(prevAgreements => {
            const updatedAgreements = {
                ...prevAgreements,
                [name]: checked
            }
            const allChecked = Object.values(updatedAgreements).every((value) => value === true)
            setAllAgreed(allChecked)
            return updatedAgreements
        })
    }

    const handleAllAgreementsChange = (e) => {
        setAgreements(prevAgreements => {
            const allChecked = !allAgreed
            const updatedAgreements = Object.keys(prevAgreements).reduce((acc, key) => {
                acc[key] = allChecked
                return acc
            }, {})
            setAllAgreed(allChecked)
            return updatedAgreements
        })
    }

    return (
        <div className="container p-4" style={{ maxWidth: "500px" }}>
            <form action="" className="space-y-4">
                <div className="flex items-center space-x-2" onClick={handleAllAgreementsChange}>
                    <input
                        onClick={(e) => e.stopPropagation()} // input 클릭 시 div의 onClick 이벤트 중단
                        onChange={handleAllAgreementsChange}
                        type="checkbox"
                        name='checkAll'
                        checked={allAgreed}
                        className='checkAll'
                    />
                    <span className="font-semibold cursor-pointer">전체 동의하기</span>
                </div>
                <div className="text-sm text-gray-600">이용약관, 개인정보 수집 및 이용, xxx(필수), xxx(선택)에 모두 동의합니다.</div>
                <ul className="space-y-4">
                    <li className="flex items-start space-x-2">
                        <input onChange={handleAgreementChange} type="checkbox" name='termsService' checked={agreements.termsService} />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <em className="text-red-500">[필수]</em>
                                <span> tripDuo 이용약관</span>
                                <button onClick={openTermServiceModal} className="w-10 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10">전체</button>
                            </div>
                            <TermServiceModal isOpen={isTermServiceModalOpen} onClose={closeTermServiceModal} />
                            <textarea value={text} readOnly className="mt-2 w-full p-2 border rounded-md"></textarea>
                        </div>
                    </li>
                    <li className="flex items-start space-x-2">
                        <input onChange={handleAgreementChange} type="checkbox" name='termsPrivacy' checked={agreements.termsPrivacy} />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <em className="text-red-500">[필수]</em>
                                <span> 개인정보 수집 및 이용에 대한 안내</span>
                                <button onClick={openTermPrivacyModal} className="w-10 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10">전체</button>
                            </div>
                            <TermPrivacyModal isOpen={isTermPrivacyModalOpen} onClose={closeTermPrivacyModal} />
                            <textarea value={text} readOnly className="mt-2 w-full p-2 border rounded-md"></textarea>
                        </div>
                    </li>
                    <li className="flex items-start space-x-2">
                        <input onChange={handleAgreementChange} type="checkbox" name='essential' checked={agreements.essential} />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <em className="text-red-500">[필수]</em>
                                <span> xxx</span>
                                <button onClick={openTermPrivacyModal} className="w-10 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10">전체</button>
                            </div>
                            <textarea value={text} readOnly className="mt-2 w-full p-2 border rounded-md"></textarea>
                        </div>
                    </li>
                    <li className="flex items-start space-x-2">
                        <input onChange={handleAgreementChange} type="checkbox" name='selective' checked={agreements.selective} />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <em className="text-green-500">[선택]</em>
                                <span> xxx</span>
                                <button onClick={openTermPrivacyModal} className="w-10 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10">전체</button>
                            </div>
                            <textarea value={text} readOnly className="mt-2 w-full p-2 border rounded-md"></textarea>
                        </div>
                    </li>
                </ul>
                <div>
                    <button onClick={() => {
                        navigate("/signup", {
                            state: {
                                termsService: agreements.termsService,
                                termsPrivacy: agreements.termsPrivacy,
                                essential: agreements.essential
                            }
                        })
                    }} disabled={isDisabled} className={`block w-full rounded-md ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500'} px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>제출</button>
                </div>
            </form>
        </div>


    );
}

export default Agreement;