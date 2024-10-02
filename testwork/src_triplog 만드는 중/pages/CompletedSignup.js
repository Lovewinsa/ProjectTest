import axios from "axios";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";


function CompletedSignup(props) {
    const location = useLocation()
    const { isAllChecked } = location.state || {}
    const navigate = useNavigate()

    const [profile, setProfile] = useState({})
    const username = useSelector(state => state.userData.username, shallowEqual)
    
    useEffect(() => {
        if (!isAllChecked) {
            alert("잘못된 경로입니다")
            navigate("/")
            
        } else {
            // window.location.reload()가 한 번만 실행되도록
            // sessionStorage에 새로고침이 한 번 이루어졌는지 여부를 저장
            const hasReloaded = sessionStorage.getItem("hasReloaded")
            if (!hasReloaded) {
                window.location.reload()
                sessionStorage.setItem("hasReloaded", "true") // 새로고침 후 플래그 설정
            }
        }
    }, [isAllChecked, navigate])

    useEffect(()=>{      
        if(username){
        axios.get(`/api/v1/users/username/${username}`)
        .then(res=>{
            console.log(res)
            setProfile(res.data)
        })
        .catch(error=>console.log(error))
        }    
    }, [username])

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                    <svg
                        viewBox="0 0 1024 1024"
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                    >
                        <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                        <defs>
                            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                <stop stopColor="#7775D6" />
                                <stop offset={1} stopColor="#E935C1" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            회원가입이 완료되었습니다.
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            추가정보 입력을 통해 TripDuo의 모든 기능을
                            <br />
                            편하게 이용해 보세요.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to={`/users/${profile.id}/profile/edit`}
                                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                추가정보 입력
                            </Link>
                            <Link to="/" className="text-sm font-semibold leading-6 text-white">
                                TripDuo 둘러보기 <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default CompletedSignup;