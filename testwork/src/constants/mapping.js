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
  { name: "여행 계획 만들기", imageSrc: "make-schedule.png", linkSrc: "/private/myPlan" },
  { name: "장소 저장하기", imageSrc: "save-place.png", linkSrc: "/private/myPlace" },
  { name: "여행 체크리스트", imageSrc: "checklist.png", linkSrc: "/private/checklist" },
  { name: "환율 정보", imageSrc: "exchange.png", linkSrc: "/private/exchangeInfo" },
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
  "남아프리카 공화국": ["케이프타운", "요하네스버그", "더반", "프리토리아"],
  // Add more countries and cities as needed
}

export const ratingConfig = [
  { min: 0, max: 1499, imageSrc: "economy-01.svg" }, // 이코노미
  { min: 1500, max: 2999, imageSrc: "economy-02.svg" }, // 프리미엄 이코노미
  { min: 3000, max: 4499, imageSrc: "business-01.svg" }, // 비지니스
  { min: 4500, max: 5999, imageSrc: "business-02.svg" }, // 프리미엄 비지니스
  { min: 6000, max: 7499, imageSrc: "first-01.svg" }, // 퍼스트
  { min: 7500, max: 8999, imageSrc: "first-02.svg" }, // 프리미엄 퍼스트
  { min: 9000, max: 10000, imageSrc: "royal-01.svg" }, // 로얄
  { min: -Infinity, max: Infinity, imageSrc: "default.svg" }, // 기본값
]

export const myPageMenuList = [
  {
    title: "Trip plan",
    subTitle: "(여행 계획)",
    content: "여행 계획을 세우고, 세운 여행 계획들을 확인할 수 있습니다.",
    link: "/private/myPlan",
  },
  {
    title: "Trip log",
    subTitle: "(여행 기록)",
    content: "작성한 여행 기록을 확인할 수 있습니다.",
    link: "/private/myTripLog",
  },
  {
    title: "Wish Mate",
    subTitle: "(관심 메이트)",
    content: "좋아요한 메이트 게시글을 확인할 수 있습니다.",
    link: "/private/wishMate",
  },
  {
    title: "My Place",
    subTitle: "(마이 플레이스)",
    content: "가고싶은 장소를 저장하고, 확인할 수 있습니다.",
    link: "/private/myPlace",
  },
  {
    title: "Liked Course",
    subTitle: "(관심 여행 계획)",
    content: "좋아요한 여행 계획을 확인할 수 있습니다.",
    link: "/private/likedCourse",
  },
  { title: "Toolbox", subTitle: "(부가 기능 site map)", content: "부가 기능", link: "/utils" },
  { title: "ADMIN DASHBOARD", subTitle: "", content: "admin dashboard", link: "/admin-dashboard" },
]

export const currencyNames = {
  USD: "미국 달러 (USD)",
  EUR: "유로 (EUR)",
  JPY: "일본 엔 (JPY)",
  GBP: "영국 파운드 (GBP)",
  CNY: "중국 위안 (CNY)",
  KRW: "대한민국 원 (KRW)",
  AUD: "호주 달러 (AUD)",
  CAD: "캐나다 달러 (CAD)",
  CHF: "스위스 프랑 (CHF)",
  HKD: "홍콩 달러 (HKD)",
  NZD: "뉴질랜드 달러 (NZD)",
  SGD: "싱가포르 달러 (SGD)",
  SEK: "스웨덴 크로나 (SEK)",
  NOK: "노르웨이 크로네 (NOK)",
  DKK: "덴마크 크로네 (DKK)",
  INR: "인도 루피 (INR)",
  BRL: "브라질 헤알 (BRL)",
  RUB: "러시아 루블 (RUB)",
  ZAR: "남아프리카 공화국 랜드 (ZAR)",
  TRY: "터키 리라 (TRY)",
  MXN: "멕시코 페소 (MXN)",
  PLN: "폴란드 즈워티 (PLN)",
  THB: "태국 바트 (THB)",
  MYR: "말레이시아 링깃 (MYR)",
  IDR: "인도네시아 루피아 (IDR)",
  PHP: "필리핀 페소 (PHP)",
  VND: "베트남 동 (VND)",
  ILS: "이스라엘 셰켈 (ILS)",
  EGP: "이집트 파운드 (EGP)",
  SAR: "사우디 리얄 (SAR)",
  AED: "아랍에미리트 디르함 (AED)",
  QAR: "카타르 리얄 (QAR)",
  KWD: "쿠웨이트 디나르 (KWD)",
  AFN: "아프가니스탄 아프가니 (AFN)",
  ALL: "알바니아 레크 (ALL)",
  AMD: "아르메니아 드람 (AMD)",
  ANG: "네덜란드령 안틸레스 길더 (ANG)",
  AOA: "앙골라 콴자 (AOA)",
  ARS: "아르헨티나 페소 (ARS)",
  AWG: "아루바 플로린 (AWG)",
  AZN: "아제르바이잔 마나트 (AZN)",
  BAM: "보스니아-헤르체고비나 마르크 (BAM)",
  BBD: "바베이도스 달러 (BBD)",
  BDT: "방글라데시 타카 (BDT)",
  BGN: "불가리아 레프 (BGN)",
  BHD: "바레인 디나르 (BHD)",
  BIF: "부룬디 프랑 (BIF)",
  BMD: "버뮤다 달러 (BMD)",
  BND: "브루나이 달러 (BND)",
  BOB: "볼리비아 볼리비아노 (BOB)",
  BSD: "바하마 달러 (BSD)",
  BTN: "부탄 눌트럼 (BTN)",
  BWP: "보츠와나 풀라 (BWP)",
  BYN: "벨라루스 루블 (BYN)",
  BZD: "벨리즈 달러 (BZD)",
  CDF: "콩고 프랑 (CDF)",
  CLP: "칠레 페소 (CLP)",
  COP: "콜롬비아 페소 (COP)",
  CRC: "코스타리카 콜론 (CRC)",
  CUP: "쿠바 페소 (CUP)",
  CVE: "카보베르데 에스쿠도 (CVE)",
  CZK: "체코 코루나 (CZK)",
  DJF: "지부티 프랑 (DJF)",
  DOP: "도미니카 페소 (DOP)",
  DZD: "알제리 디나르 (DZD)",
  ERN: "에리트레아 나크파 (ERN)",
  ETB: "에티오피아 비르 (ETB)",
  FJD: "피지 달러 (FJD)",
  FKP: "포클랜드 제도 파운드 (FKP)",
  FOK: "페로 제도 크로네 (FOK)",
  GEL: "조지아 라리 (GEL)",
  GGP: "건지 파운드 (GGP)",
  GHS: "가나 세디 (GHS)",
  GIP: "지브롤터 파운드 (GIP)",
  GMD: "감비아 달라시 (GMD)",
  GNF: "기니 프랑 (GNF)",
  GTQ: "과테말라 케찰 (GTQ)",
  GYD: "가이아나 달러 (GYD)",
  HNL: "온두라스 렘피라 (HNL)",
  HRK: "크로아티아 쿠나 (HRK)",
  HTG: "아이티 구르드 (HTG)",
  HUF: "헝가리 포린트 (HUF)",
  IQD: "이라크 디나르 (IQD)",
  IRR: "이란 리얄 (IRR)",
  ISK: "아이슬란드 크로나 (ISK)",
  JEP: "저지 파운드 (JEP)",
  JMD: "자메이카 달러 (JMD)",
  JOD: "요르단 디나르 (JOD)",
  KES: "케냐 실링 (KES)",
  KGS: "키르기스스탄 솜 (KGS)",
  KHR: "캄보디아 리엘 (KHR)",
  KMF: "코모로 프랑 (KMF)",
  KYD: "케이맨 제도 달러 (KYD)",
  KZT: "카자흐스탄 텡게 (KZT)",
  LAK: "라오스 킵 (LAK)",
  LBP: "레바논 파운드 (LBP)",
  LKR: "스리랑카 루피 (LKR)",
  LRD: "라이베리아 달러 (LRD)",
  LSL: "레소토 로티 (LSL)",
  LYD: "리비아 디나르 (LYD)",
  MAD: "모로코 디르함 (MAD)",
  MDL: "몰도바 레우 (MDL)",
  MGA: "마다가스카르 아리아리 (MGA)",
  MKD: "북마케도니아 디나르 (MKD)",
  MMK: "미얀마 짯 (MMK)",
  MNT: "몽골 투그릭 (MNT)",
  MOP: "마카오 파타카 (MOP)",
  MRU: "모리타니 우기야 (MRU)",
  MUR: "모리셔스 루피 (MUR)",
  MVR: "몰디브 루피아 (MVR)",
  MWK: "말라위 콰차 (MWK)",
  MZN: "모잠비크 메티칼 (MZN)",
  NAD: "나미비아 달러 (NAD)",
  NGN: "나이지리아 나이라 (NGN)",
  NIO: "니카라과 코르도바 (NIO)",
  OMR: "오만 리얄 (OMR)",
  PAB: "파나마 발보아 (PAB)",
  PEN: "페루 솔 (PEN)",
  PGK: "파푸아뉴기니 키나 (PGK)",
  PKR: "파키스탄 루피 (PKR)",
  PYG: "파라과이 과라니 (PYG)",
  RON: "루마니아 레우 (RON)",
  RSD: "세르비아 디나르 (RSD)",
  RWF: "르완다 프랑 (RWF)",
  SBD: "솔로몬 제도 달러 (SBD)",
  SCR: "세이셸 루피 (SCR)",
  SDG: "수단 파운드 (SDG)",
  SLE: "시에라리온 리온 (SLE)",
  SLL: "시에라리온 리온 (SLL)",
  SOS: "소말리아 실링 (SOS)",
  SRD: "수리남 달러 (SRD)",
  SSP: "남수단 파운드 (SSP)",
  STN: "상투메 프린시페 도브라 (STN)",
  SYP: "시리아 파운드 (SYP)",
  SZL: "에스와티니 릴랑게니 (SZL)",
  TJS: "타지키스탄 소모니 (TJS)",
  TMT: "투르크메니스탄 마나트 (TMT)",
  TND: "튀니지 디나르 (TND)",
  TOP: "통가 파앙가 (TOP)",
  TTD: "트리니다드 토바고 달러 (TTD)",
  TWD: "대만 달러 (TWD)",
  TZS: "탄자니아 실링 (TZS)",
  UAH: "우크라이나 흐리브냐 (UAH)",
  UGX: "우간다 실링 (UGX)",
  UYU: "우루과이 페소 (UYU)",
  UZS: "우즈베키스탄 솜 (UZS)",
  VES: "베네수엘라 볼리바르 (VES)",
  WST: "사모아 탈라 (WST)",
  XAF: "중앙아프리카 CFA 프랑 (XAF)",
  XCD: "동카리브 달러 (XCD)",
  XOF: "서아프리카 CFA 프랑 (XOF)",
  XPF: "프랑스령 폴리네시아 프랑 (XPF)",
  YER: "예멘 리얄 (YER)",
  ZMW: "잠비아 콰차 (ZMW)",
  IMP: "맨 섬 파운드 (IMP)",
  KID: "키리바시 달러 (KID)",
  NPR: "네팔 루피 (NPR)",
  SHP: "세인트헬레나 파운드 (SHP)",
  TVD: "투발루 달러 (TVD)",
  VUV: "바누아투 바투 (VUV)",
  XDR: "특별인출권 (XDR)",
  ZWL: "짐바브웨 달러 (ZWL)",
}
