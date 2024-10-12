import axios from "axios";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

function WishMate(props) {
  const loggedInUserId = useSelector((state) => state.userData.id, shallowEqual); // 로그인된 user의 id
  const [course, setCourse] = useState({});
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/v1/posts/${loggedInUserId}/likes`)
      .then((response) => {
        console.log(response.data);
        setPostList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // city 또는 country 값에 따른 이미지 파일명 변환 함수
  const getImageFileName = (city, country) => {
    const cityMapping = {
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
    };

    const countryMapping = {
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
    };

    // city 값이 있으면 city에 맞는 이미지, 없으면 country에 맞는 이미지 반환
    if (city && cityMapping[city]) {
      return cityMapping[city];
    } else if (country && countryMapping[country]) {
      return countryMapping[country];
    } else {
      return "defaultImage"; // 매핑되지 않은 경우 기본값 처리
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 max-w-[1024px]">
        {course ? (
          <>
            <div className="py-5">
              <p className="font-bold text-xl text-center">관심 메이트 목록</p>
            </div>
            <ul className="space-y-4">
              {postList
                .filter((post) => post.post.type === "MATE")
                .map((post) => {
                  const imageFileName = getImageFileName(post.post.city, post.post.country);
                  const imagePath = `/img/countryImages/${imageFileName}.jpg`;
                  return (
                    <li
                      key={post.post.id}
                      className={`p-4 border rounded-lg shadow-md border border-green-600 hover:scale-102 transition duration-300 hover:shadow-xl`}
                      style={{
                        backgroundImage: `linear-gradient(to right,
                        rgba(255, 255, 255, 1) 0%, 
                        rgba(255, 255, 255, 1) 20%, 
                        rgba(255, 255, 255, 0.5) 40%, 
                        rgba(255, 255, 255, 0) 60%, 
                        rgba(255, 255, 255, 0) 80%),
                        url(${imagePath})`,
                        backgroundSize: "cover", // 이미지 채우기
                        backgroundPosition: "center",
                        // /* 혼합 모드 설정 */
                        mixBlendMode: "multiply",
                      }}>
                      <a href={`/posts/mate/${post.post.id}/detail`} className="block">
                        <div className="md:flex justify-between">
                          <h4 className="text-xl font-semibold">{post.post.title}</h4>
                          <p>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                              #{post.post.city}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                              #{post.post.country}
                            </span>
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          작성일: {new Date(post.post.createdAt).toLocaleDateString()}
                        </p>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </>
        ) : (
          <>
            <h3>계획중인 여행이 없습니다</h3>
          </>
        )}
      </div>
    </>
  );
}

export default WishMate;
