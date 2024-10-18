export const carouselItems = [
  { name: "item1", imageSrc: "KOR_01.jpg", linkSrc: "/posts/course?di=Domestic" },
  { name: "item2", imageSrc: "AUS_01.jpg", linkSrc: "/posts/course?di=International" },
  { name: "item3", imageSrc: "RUS_01.jpg", linkSrc: "/posts/mate?di=Domestic" },
  { name: "item4", imageSrc: "USA_01.jpg", linkSrc: "/posts/mate?di=International" },
  { name: "item5", imageSrc: "BRA_01.jpg", linkSrc: "/checklist" },
]

export const menuItems = [
  { name: "국내 여행코스", imageSrc: "course-domestic.png", linkSrc: "/posts/course?di=Domestic" },
  { name: "해외 여행코스", imageSrc: "course-international.png", linkSrc: "/posts/course?di=International" },
  { name: "국내 메이트 찾기", imageSrc: "mate-domestic.png", linkSrc: "/posts/mate?di=Domestic" },
  { name: "해외 메이트 찾기", imageSrc: "mate-international.png", linkSrc: "/posts/mate?di=International" },
  { name: "여행 계획 만들기", imageSrc: "make-schedule.png", linkSrc: "/myPlan" },
  { name: "장소 저장하기", imageSrc: "save-place.png", linkSrc: "/myPlace" },
  { name: "여행 체크리스트", imageSrc: "checklist.png", linkSrc: "/checklist" },
  { name: "환율 정보", imageSrc: "exchange.png", linkSrc: "/exchangeInfo" },
]

export const reviewPositiveTagList = [
  { key: 1, keyword: "COMMUNICATION", text: "메시지에 항상 빠르게 답변해주어 소통이 원활했어요." },
  { key: 2, keyword: "TRUST", text: "계획된 일정을 철저히 지켜 믿음직했어요." },
  { key: 3, keyword: "ONTIME", text: "약속 시간을 잘 지켜 여유로운 여행을 즐길 수 있었어요." },
  { key: 4, keyword: "MANNER", text: "친절하고 배려심 넘치는 태도로 편안하게 여행했어요." },
  { key: 5, keyword: "FLEXIBLE", text: "변경된 계획에도 유연하게 대처하여 즐거운 여행이 되었어요." },
  { key: 6, keyword: "ACTIVE", text: "적극적인 태도로 다양한 경험을 할 수 있도록 이끌어주었어요." },
  { key: 7, keyword: "FRIENDLY", text: "함께 시간을 보내는 내내 즐거웠고, 좋은 친구를 얻은 기분이었어요." },
  { key: 8, keyword: "PAY", text: "비용 분담에 있어 투명하고 공정하게 처리하여 신뢰가 갔어요." },
  { key: 9, keyword: "CLEAN", text: "깔끔한 여행 스타일로 쾌적한 환경을 유지해주었어요." },
]

export const reviewNegativeTagList = [
  { key: 1, keyword: "COMMUNICATION", text: "메시지 답변이 느려서 소통에 어려움을 느꼈어요." },
  { key: 2, keyword: "TRUST", text: "계획된 일정을 자주 변경하여 불안했어요." },
  { key: 3, keyword: "ONTIME", text: "약속 시간에 자주 늦어 불편했어요." },
  { key: 4, keyword: "MANNER", text: "무례한 언행으로 불쾌한 경험을 했어요." },
  { key: 5, keyword: "FLEXIBLE", text: "변경된 상황에 대한 대처가 미흡하여 아쉬웠어요." },
  { key: 6, keyword: "ACTIVE", text: "소극적인 태도로 여행에 대한 적극적인 참여가 부족했어요." },
  { key: 7, keyword: "FRIENDLY", text: "함께 시간을 보내는 것이 불편했어요." },
  { key: 8, keyword: "PAY", text: "비용 분담에 있어 불투명하고 불공정하여 신뢰가 떨어졌어요." },
  { key: 9, keyword: "CLEAN", text: "개인 위생 관리가 부족하여 함께 여행하는 것이 불편했어요." },
]

export const cityMapping = {
  // 대한민국
  서울: "KOR_Seoul_01",
  부산: "KOR_Busan_01",
  제주: "KOR_Jeju_01",
  인천: "KOR_Incheon_01",
  // 일본
  도쿄: "JPN_Tokyo_01",
  오사카: "JPN_Osaka_01",
  교토: "JPN_Kyoto_01",
  삿포로: "JPN_Sapporo_01",
  // 중국
  베이징: "CHN_Beijing_01",
  상하이: "CHN_Shanghai_01",
  광저우: "CHN_Guangzhou_01",
  시안: "CHN_Xian_01",
  // 인도
  델리: "IND_Delhi_01",
  뭄바이: "IND_Mumbai_01",
  콜카타: "IND_Kolkata_01",
  벵갈루루: "IND_Bengaluru_01",
  // 스페인
  바르셀로나: "ESP_Barcelona_01",
  그라나다: "ESP_Granada_01",
  마드리드: "ESP_Madrid_01",
  세비야: "ESP_Seville_01",
  // 영국
  런던: "GBR_London_01",
  맨체스터: "GBR_Manchester_01",
  버밍엄: "GBR_Birmingham_01",
  리버풀: "GBR_Liverpool_01",
  // 독일
  베를린: "DEU_Berlin_01",
  뮌헨: "DEU_Munich_01",
  프랑크푸르트: "DEU_Frankfurt_01",
  함부르크: "DEU_Hamburg_01",
  // 프랑스
  파리: "FRA_Paris_01",
  마르세유: "FRA_Marseille_01",
  리옹: "FRA_Lyon_01",
  니스: "FRA_Nice_01",
  // 이탈리아
  로마: "ITA_Roma_01",
  밀라노: "ITA_Milano_01",
  베네치아: "ITA_Venezia_01",
  피렌체: "ITA_Firenze_01",
  // 미국
  뉴욕: "USA_NewYork_01",
  로스앤젤레스: "USA_LosAngeles_01",
  시카고: "USA_Chicago_01",
  마이애미: "USA_Miami_01",
  // 캐나다
  토론토: "CAN_Toronto_01",
  밴쿠버: "CAN_Vancouver_01",
  몬트리올: "CAN_Montreal_01",
  오타와: "CAN_Ottawa_01",
  // 브라질
  상파울루: "BRA_SaoPaulo_01",
  리우데자네이루: "BRA_RioDeJaneiro_01",
  브라질리아: "BRA_Brasilia_01",
  살바도르: "BRA_Salvador_01",
  // 호주
  시드니: "AUS_Sydney_01",
  멜버른: "AUS_Melbourne_01",
  브리즈번: "AUS_Brisbane_01",
  퍼스: "AUS_Perth_01",
  // 러시아
  모스크바: "RUS_Moscow_01",
  상트페테르부르크: "RUS_SaintPetersburg_01",
  노보시비르스크: "RUS_Novosibirsk_01",
  예카테린부르크: "RUS_Yekaterinburg_01",
  // 남아프리카 공화국
  케이프타운: "ZAF_CapeTown_01",
  요하네스버그: "ZAF_Johannesburg_01",
  더반: "ZAF_Durban_01",
  프리토리아: "ZAF_Pretoria_01",
}

export const countryMapping = {
  대한민국: "KOR_01",
  일본: "JPN_01",
  중국: "CHN_01",
  인도: "IND_01",
  스페인: "ESP_01",
  영국: "GBR_01",
  독일: "DEU_01",
  프랑스: "FRA_01",
  이탈리아: "ITA_01",
  미국: "USA_01",
  캐나다: "CAN_01",
  브라질: "BRA_01",
  호주: "AUS_01",
  러시아: "RUS_01",
  "남아프리카 공화국": "ZAF_01",
}

//테스트 데이터
export const citiesByCountry = {
  대한민국: ["서울", "부산", "제주", "인천"],
  일본: ["도쿄", "오사카", "교토", "삿포로"],
  중국: ["베이징", "상하이", "광저우", "시안"],
  인도: ["델리", "뭄바이", "콜카타", "벵갈루루"],
  영국: ["런던", "맨체스터", "버밍엄", "리버풀"],
  독일: ["베를린", "뮌헨", "프랑크푸르트", "함부르크"],
  프랑스: ["파리", "마르세유", "리옹", "니스"],
  이탈리아: ["로마", "밀라노", "베네치아", "피렌체"],
  미국: ["뉴욕", "로스앤젤레스", "시카고", "마이애미"],
  캐나다: ["토론토", "밴쿠버", "몬트리올", "오타와"],
  브라질: ["상파울루", "리우데자네이루", "브라질리아", "살바도르"],
  호주: ["시드니", "멜버른", "브리즈번", "퍼스"],
  러시아: ["모스크바", "상트페테르부르크", "노보시비르스크", "예카테린부르크"],
  "남아프리카 공활국": ["케이프타운", "요하네스버그", "더반", "프리토리아"],
  // Add more countries and cities as needed
}

// export const ratingConfig = [
//   { min: 0, max: 1499, icon: faFeather, color: "gray" }, // 이코노미
//   { min: 1500, max: 2999, icon: faFeather, color: "blue" }, // 프리미엄 이코노미
//   { min: 3000, max: 4499, icon: faDove, color: "gray" }, // 비지니스
//   { min: 4500, max: 5999, icon: faDove, color: "blue" }, // 프리미엄 비지니스
//   { min: 6000, max: 7499, icon: faPlane, color: "gray" }, // 퍼스트
//   { min: 7500, max: 8999, icon: faPlane, color: "blue" }, // 프리미엄 퍼스트
//   { min: 9000, max: 10000, icon: faCrown, color: "yellow" }, // 로얄
//   { min: -Infinity, max: Infinity, icon: faUser, color: "black" }, // 기본값
// ]
