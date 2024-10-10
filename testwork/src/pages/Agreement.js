import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TermServiceModal from '../components/TermServiceModal';
import TermPrivacyModal from '../components/TermPrivacyModal';

function Agreement() {
    useEffect(()=>{
        // 스크롤을 화면 위로
        window.scrollTo(0, 0);
    }, [])
    // 약관 전체 동의 상태를 관리하는 상태 변수
    const [allAgreed, setAllAgreed] = useState(false);

    // 개별 약관 동의 상태를 관리하는 상태 변수
    const [agreements, setAgreements] = useState({
        termsService: false,
        termsPrivacy: false,
        essential: false,
        selective: false,
    });

    // 버튼 비활성화를 위한 상태 변수
    const [isDisabled, setIsDisabled] = useState(true); 

    // 각 모달(이용약관, 개인정보 수집)을 관리하는 상태 변수
    const [modals, setModals] = useState({
        termsService: false,
        termsPrivacy: false,
    });

    const navigate = useNavigate();

    // 모달 토글 함수
    const toggleModal = (name) => {
        //모달이 열려 있는지 또는 닫혀 있는지에 따라 그 상태를 반대로 바꿔준다
        setModals((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    // 제출 버튼 활성화 상태를 업데이트하는 함수
    const updateSubmitButtonState = (updatedAgreements) => {
        const essentialChecked = Object.values(updatedAgreements).slice(0, 3).every((value) => value === true);
        // 필수 항목이 모두 체크된 경우 버튼 활성화
        setIsDisabled(!essentialChecked); 
    };

    // 개별 약관 동의 상태를 업데이트하고, 제출 버튼 상태도 동시에 업데이트
    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        setAgreements((prev) => {
            const updatedAgreements = { ...prev, [name]: checked };
            setAllAgreed(Object.values(updatedAgreements).every((value) => value === true));
            updateSubmitButtonState(updatedAgreements); 
            return updatedAgreements;
        });
    };

    // 전체 동의 체크박스를 클릭할 때 모든 약관의 동의 상태를 업데이트하고, 제출 버튼 상태도 업데이트
    const handleAllAgreementsChange = () => {
        const allChecked = !allAgreed;
        setAgreements((prev) => {
            const updated = Object.keys(prev).reduce((acc, key) => {
                //모든 약관의 동의 상태를 전체 동의 상태에 맞춰 설정
                acc[key] = allChecked;
                return acc;
            }, {});
            setAllAgreed(allChecked);
            updateSubmitButtonState(updated); // 제출 버튼 상태 업데이트
            return updated;
        });
    };

    // 약관 항목을 렌더링하는 컴포넌트
    const AgreementItem = ({ name, label, isRequired, modalType }) => (
        <li className="flex items-start space-x-2">
            <input
                onChange={handleAgreementChange} // 체크박스 상태가 바뀔 때 handleAgreementChange 호출
                type="checkbox"
                name={name}
                checked={agreements[name]} // 상태에 따라 체크박스가 체크되도록 설정
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <em className={isRequired ? 'text-red-500' : 'text-green-500'}>
                        [{isRequired ? '필수' : '선택'}]
                    </em>
                    <span>{label}</span>
                    <button
                        onClick={() => toggleModal(modalType)} // '전체' 버튼 클릭 시 모달 열기/닫기
                        className="w-10 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        전체
                    </button>
                </div>
                <textarea
                    value="약관내용..." // 약관 내용을 보여주기 위한 고정된 텍스트
                    readOnly
                    className="mt-2 w-full p-2 border rounded-md"
                />
            </div>
        </li>
    );

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <form className="space-y-4">
                {/* 전체 동의 체크박스 */}
                <div className="flex items-center space-x-2" onClick={handleAllAgreementsChange}>
                    <input
                        onClick={(e) => e.stopPropagation()} // div 클릭 이벤트와 구분하기 위해 input 클릭 이벤트 중단
                        onChange={handleAllAgreementsChange} // 전체 동의 상태 변경
                        type="checkbox"
                        name="checkAll"
                        checked={allAgreed}
                        className="checkAll"
                    />
                    <span className="font-semibold cursor-pointer">전체 동의하기</span>
                </div>
                <div className="text-sm text-gray-600">
                    이용약관, 개인정보 수집 및 이용, xxx(필수), xxx(선택)에 모두 동의합니다.
                </div>
                {/* 개별 약관 항목 렌더링 */}
                <ul className="space-y-4">
                    <AgreementItem name="termsService" label="tripDuo 이용약관" isRequired modalType="termsService" />
                    <AgreementItem name="termsPrivacy" label="개인정보 수집 및 이용에 대한 안내" isRequired modalType="termsPrivacy" />
                    <AgreementItem name="essential" label="필수인 xxx" isRequired modalType="termsPrivacy" />
                    <AgreementItem name="selective" label="선택인 yyy" isRequired={false} modalType="termsPrivacy" />
                </ul>
                {/* 제출 버튼 */}
                <div>
                    <button
                        onClick={() => {
                            navigate('/signup', {
                                state: {
                                    termsService: agreements.termsService,
                                    termsPrivacy: agreements.termsPrivacy,
                                    essential: agreements.essential,
                                },
                            });
                        }}
                        disabled={isDisabled} // 필수 약관이 모두 체크되지 않으면 버튼 비활성화
                        className={`block w-full rounded-md ${
                            isDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 비활성화 상태
                                : 'bg-indigo-600 text-white hover:bg-indigo-500' // 활성화 상태
                        } px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                        제출
                    </button>
                </div>
            </form>
            {/* 모달 컴포넌트 렌더링 */}
            <TermServiceModal isOpen={modals.termsService} onClose={() => toggleModal('termsService')} />
            <TermPrivacyModal isOpen={modals.termsPrivacy} onClose={() => toggleModal('termsPrivacy')} />
        </div>
    );
}

export default Agreement;
