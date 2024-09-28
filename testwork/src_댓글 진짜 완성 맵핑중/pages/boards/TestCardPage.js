import React, { useState } from "react"

const TestCardPage = () => {
  
  // 글 목록 정보
  const [pageInfo, setPageInfo] = useState([])

  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const cardsPerPage = 12 // 한 페이지에 보여줄 카드 수
  const totalPages = Math.ceil(pageInfo.length / cardsPerPage) // 총 페이지 수

  // 페이지당 보여줄 게시물 계산
  const indexOfLastPost = currentPage * cardsPerPage
  const indexOfFirstPost = indexOfLastPost - cardsPerPage
  const currentPosts = pageInfo.slice(indexOfFirstPost, indexOfLastPost)

  // 페이지 번호 계산 (한 번에 5개씩 보여줌)
  const pageNumbers = []
  const maxPageNumbersToShow = 5
  const pageStartIndex = Math.floor((currentPage - 1) / maxPageNumbersToShow) * maxPageNumbersToShow + 1
  const pageEndIndex = Math.min(pageStartIndex + maxPageNumbersToShow - 1, totalPages)

  for (let i = pageStartIndex; i <= pageEndIndex; i++) {
    pageNumbers.push(i)
  }

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">게시판</h1>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{post.title}</h2>
                <p className="text-sm text-gray-600">작성자: {post.author}</p>
                <p className="text-sm text-gray-600">작성일: {post.date}</p>
                <p className="text-sm text-right text-green-800 font-semibold">
                  {post.country} - {post.city}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-500">⭐ {post.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">조회수: {post.views}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold"></p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이징 버튼 */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
            }`}>
            &lt;
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              }`}>
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
            }`}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestCardPage
