import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, ListGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Home.css';

function HomeInternational() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState('해외');

    const [searchParams, setSearchParams] = useState({
        location: '',
        dateRange: '',
        travelStyle: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('Searching with params:', searchParams);
        navigate('/search-results', { state: searchParams });
    };

    const handleSelect = (eventKey) => {
        setSelectedOption(eventKey === 'Home' ? '국내' : '해외');
        if (eventKey === 'Home') {
            navigate('/');
        } else if (eventKey === 'international') {
            navigate('/home-inter');
        }
    };

    return (
        <Container>
            {/* 상단에 국내/해외 선택 드롭다운 */}
            <Row className="justify-content-end" style={{ paddingTop: '10px' }}>
                <Col xs="auto">
                    <Dropdown onSelect={handleSelect}>
                        <Dropdown.Toggle 
                            variant="secondary" 
                            id="dropdown-basic" 
                            size="sm" 
                            style={{ width: '60px', padding: '5px 5px' }}
                        >
                            {selectedOption}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="Home">국내</Dropdown.Item>
                            <Dropdown.Item eventKey="international">해외</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            {/* 메인 검색 바 */}
            <Row className="my-4">
                <Col md={8} className="mx-auto">
                    <h2>해외 여행 메이트 찾기</h2>
                    <Form>
                        <Form.Group controlId="formLocation">
                            <Form.Label>여행지</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="해외 여행지를 입력하세요..." 
                                name="location"
                                value={searchParams.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateRange" className="mt-3">
                            <Form.Label>여행 기간</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="여행 기간을 입력하세요..." 
                                name="dateRange"
                                value={searchParams.dateRange}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTravelStyle" className="mt-3">
                            <Form.Label>여행 스타일</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="여행 스타일을 입력하세요..." 
                                name="travelStyle"
                                value={searchParams.travelStyle}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-3" onClick={handleSearch}>
                            검색
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* 추천 여행 메이트 */}
            <Row className="my-4">
                <Col>
                    <h3>추천 해외 여행 메이트</h3>
                    <Row>
                        {/* 예시로 3명의 여행 메이트 카드 표시 */}
                        {[1, 2, 3].map((mate) => (
                            <Col md={4} key={mate} className="mb-3">
                                <Card>
                                    <Card.Img variant="top" src={`https://picsum.photos/200/150?random=${mate + 10}`} />
                                    <Card.Body>
                                        <Card.Title>여행 메이트 {mate}</Card.Title>
                                        <Card.Text>
                                            이 메이트는 {mate}번 해외 여행 스타일을 선호합니다.
                                        </Card.Text>
                                        <Button variant="primary">프로필 보기</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* 인기 여행지 섹션 */}
            <Row className="my-4">
                <Col>
                    <h3>인기 해외 여행지</h3>
                    <Row>
                        {[1, 2, 3].map((dest) => (
                            <Col md={4} key={dest} className="mb-3">
                                <Card>
                                    <Card.Img variant="top" src={`https://picsum.photos/200/150?random=${dest + 20}`} />
                                    <Card.Body>
                                        <Card.Title>해외 여행지 {dest}</Card.Title>
                                        <Card.Text>
                                            이 여행지는 {dest}번 해외 여행 스타일과 잘 어울립니다.
                                        </Card.Text>
                                        <Button variant="primary">더 알아보기</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* 사용자 리뷰 및 성공 사례 */}
            <Row className="my-4">
                <Col>
                    <h3>사용자 리뷰 및 성공 사례</h3>
                    <ListGroup>
                        <ListGroup.Item>리뷰 1: 이 사이트를 통해 최고의 해외 여행 메이트를 만났어요!</ListGroup.Item>
                        <ListGroup.Item>리뷰 2: 함께한 해외 여행이 잊을 수 없는 추억이 되었어요.</ListGroup.Item>
                        <ListGroup.Item>리뷰 3: 다음 해외 여행도 여기서 메이트를 구할 거예요!</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            {/* 뉴스레터 가입 */}
            <Row className="my-4">
                <Col md={8} className="mx-auto">
                    <h3>뉴스레터 가입</h3>
                    <Form>
                        <Form.Group controlId="formNewsletter">
                            <Form.Label>이메일 주소</Form.Label>
                            <Form.Control type="email" placeholder="이메일을 입력하세요..." />
                        </Form.Group>
                        <Button variant="primary" className="mt-3">가입하기</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default HomeInternational;
