import { useEffect, useState } from "react";
import { useParams } from "react-router";


function MateBoard() {

    const {id} = useParams()
    
    const [domesticInternational, setDomesticInternational] = useState("International")
    const [whereAreYou, setWhereAreYou] = useState(null)

    //이벤트 관리부
    const handleButtonClick = ()=>{
        if(domesticInternational === "International"){ // 국내 상태에서 눌렀을 때
            //상태 변경
            setDomesticInternational("Domestic")
        }else if(domesticInternational === "Domestic"){
            setDomesticInternational("International")
        }
    }

    useEffect(()=>{
        if(domesticInternational === "International"){ // 국내 상태에서 눌렀을 때
            //국내 메이트 게시판 요청
            setWhereAreYou("국내 여행 메이트 페이지")

        }else if(domesticInternational === "Domestic"){
            //해외 메이트 게시판 요청
            setWhereAreYou("해외 여행 메이트 페이지")

        }
    },[domesticInternational])

    return (
        <>
            <h3>{whereAreYou}</h3>

            <button className="mt-30" onClick={handleButtonClick}>to {domesticInternational}</button>

        </>
    );
}

export default MateBoard;