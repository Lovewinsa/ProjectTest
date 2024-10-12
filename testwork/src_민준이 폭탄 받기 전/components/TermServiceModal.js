import React, { memo } from "react";

const TermServiceModal = memo(({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={onClose} // 배경을 클릭하면 모달 닫기
        >
            <div 
                className="bg-white w-full max-w-md max-h-[90vh] rounded-lg shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게 함
            >
                <div className="px-6 py-4">
                    <h1 className="text-lg font-bold text-center mb-4">이용약관</h1>
                    <div className="text-sm leading-relaxed text-gray-700 overflow-y-auto max-h-[60vh]">
                        <p>개인정보보호법에 따라 네이버에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.</p>
                        <br />
                        <h2 className="font-semibold">1. 수집하는 개인정보</h2>
                        <p>
                            이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다. 이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은 회원제 서비스를 이용하기 위해 회원가입을 할 경우, 네이버는 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.
                        </p>
                        <p className="font-bold mt-4">회원가입 시점에 네이버가 이용자로부터 수집하는 개인정보는 아래와 같습니다.</p>
                        <ul className="list-disc list-inside">
                            <li>회원 가입 시 필수항목으로 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호를, 선택항목으로 본인확인 이메일주소를 수집합니다.</li>
                            <li>실명 인증된 아이디로 가입 시, 암호화된 동일인 식별정보(CI), 중복가입 확인정보(DI), 내외국인 정보를 함께 수집합니다.</li>
                            <li>단체 회원가입 시 필수 항목으로 단체아이디, 비밀번호, 단체이름, 이메일주소, 휴대전화번호를, 선택항목으로 단체 대표자명을 수집합니다.</li>
                        </ul>
                        <p className="font-bold mt-4">서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와 같습니다.</p>
                        <ul className="list-disc list-inside">
                            <li>회원정보 또는 개별 서비스에서 프로필 정보(별명, 프로필 사진)를 설정할 수 있습니다.</li>
                            <li>IP 주소, 쿠키, 서비스 이용 기록, 기기정보, 위치정보가 생성되어 수집될 수 있습니다.</li>
                        </ul>
                        <p className="mt-4">
                            구체적으로 1) 서비스 이용 과정에서 이용자에 관한 정보를 자동화된 방법으로 생성하거나 이용자가 입력한 정보를 저장(수집)하거나, 2) 이용자 기기의 고유한 정보를 원래의 값을 확인하지 못 하도록 안전하게 변환하여 수집합니다.
                        </p>
                        <p className="font-bold mt-4">생성정보 수집에 대한 추가 설명</p>
                        <p><span className="font-bold">IP(Internet Protocol) 주소란?</span> 인터넷 망 사업자가 기기에 부여하는 온라인 주소 정보입니다.</p>
                        <p><span className="font-bold">서비스 이용기록이란?</span> 네이버 접속 일시, 이용한 서비스 목록 및 서비스 이용 과정에서 발생하는 정상 또는 비정상 로그 일체, 이메일 수발신 과정에서 기록되는 이메일주소, 휴대전화번호 등을 의미합니다.</p>

                        <p className="font-bold mt-4">2. 수집한 개인정보의 이용</p>
                        <p>네이버 및 네이버 관련 제반 서비스(모바일 웹/앱 포함)의 회원관리, 서비스 개발・제공 및 향상, 안전한 인터넷 이용환경 구축 등 아래의 목적으로만 개인정보를 이용합니다.</p>

                        <p className="font-bold mt-4">3. 개인정보 보관기간</p>
                        <p>회사는 원칙적으로 이용자의 개인정보를 회원 탈퇴 시 지체없이 파기하고 있습니다. 단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.</p>

                        <p className="font-bold mt-4">4. 개인정보 수집 및 이용 동의를 거부할 권리</p>
                        <p>이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다. 필수 항목에 대한 동의를 거부할 경우 회원가입이 어려울 수 있습니다.</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                    <button
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                        onClick={onClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
});

export default TermServiceModal;
