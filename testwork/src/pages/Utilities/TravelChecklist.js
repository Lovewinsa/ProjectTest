import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";

function TravelChecklist() {
    const rawToken = localStorage.getItem('token') || localStorage.getItem('KakaoToken');
    const token = rawToken ? rawToken.replace('Bearer ', '') : null;
    const LOCAL_STORAGE_KEY = `checklist_${token ? token.split('.')[1] : 'default'}`;

    const initialItems = [
            { id: 1, category: "기내에 들고 탈 가방", name: "여권", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 2, category: "기내에 들고 탈 가방", name: "E-ticket", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 3, category: "기내에 들고 탈 가방", name: "바우처(호텔, 액티비티 등)", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 4, category: "기내에 들고 탈 가방", name: "현금, 신용카드", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 5, category: "기내에 들고 탈 가방", name: "국제면허증", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 6, category: "기내에 들고 탈 가방", name: "볼펜(입국신고서 작성용)", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 7, category: "기내에 들고 탈 가방", name: "목베개, 얇은 스카프(또는 담요), 안대", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 8, category: "기내에 들고 탈 가방", name: "스마트폰 충전기(공항 또는 기내에서 충전)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 9, category: "기내에 들고 탈 가방", name: "미리 사둔 SIM카드 또는 포켓와이파이", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 10, category: "기내에 들고 탈 가방", name: "보조배터리", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 11, category: "기내에 들고 탈 가방", name: "카메라(그 외 전자제품)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 12, category: "기내에 들고 탈 가방", name: "귀중품", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 13, category: "캐리어", name: "옷", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 14, category: "캐리어", name: "속옷", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 15, category: "캐리어", name: "잠옷", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 16, category: "캐리어", name: "양말", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 17, category: "캐리어", name: "여벌 신발", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 18, category: "세면도구", name: "치약, 칫솔", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 19, category: "세면도구", name: "클렌징 용품", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 20, category: "세면도구", name: "샴푸, 린스", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 21, category: "세면도구", name: "바디워시, 샤워볼", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 22, category: "세면도구", name: "면도기", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 23, category: "세면도구", name: "수건", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 24, category: "소품", name: "선크림", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 25, category: "소품", name: "각종 충전기", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 26, category: "소품", name: "멀티어댑터", quantity: 1, checked: false, isInternationalOnly: true },
            { id: 27, category: "소품", name: "선글라스", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 28, category: "소품", name: "셀카봉", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 29, category: "소품", name: "여성용품", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 30, category: "소품", name: "상비약", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 31, category: "챙기면 더 좋은 기타 용품", name: "지퍼백(젖은 물건 보관)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 32, category: "챙기면 더 좋은 기타 용품", name: "면봉", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 33, category: "챙기면 더 좋은 기타 용품", name: "비상 식량", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 34, category: "챙기면 더 좋은 기타 용품", name: "옷걸이(속옷이나 양말 말리기)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 35, category: "챙기면 더 좋은 기타 용품", name: "보조가방(손이나 짐 담기)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 36, category: "챙기면 더 좋은 기타 용품", name: "압축팩(짐 부피 줄이기)", quantity: 1, checked: false, isInternationalOnly: false },
            { id: 37, category: "챙기면 더 좋은 기타 용품", name: "손톱깎이(장기여행 시)", quantity: 1, checked: false, isInternationalOnly: false }
    ];

    const [items, setItems] = useState(initialItems);
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [travelDays, setTravelDays] = useState(1);
    const [isInternational, setIsInternational] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedItems) {
            setItems(JSON.parse(savedItems));
        }
    }, [LOCAL_STORAGE_KEY]);

    useEffect(() => {
        if (items !== initialItems) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, LOCAL_STORAGE_KEY]);

    // 필터링된 items 반환
    const getFilteredItems = () => {
        return items.filter(item => {
            return isInternational ? true : !item.isInternationalOnly;
        });
    };

    const handleCheckChange = (id) => {
        const updatedItems = items.map(item => (
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
        setItems(updatedItems);
    };

    const handleAddItem = () => {
        if (newItemName && newItemCategory) {
            const updatedItems = [
                ...items,
                { id: Date.now(), category: newItemCategory, name: newItemName, quantity: 1, checked: false, isInternationalOnly: false }
            ];
            setItems(updatedItems);
            setNewItemName("");
            setNewItemCategory("");
        }
    };

    const handleRemoveItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
    };

    const handleDetailChange = (id, details) => {
        const updatedItems = items.map(item => (
            item.id === id ? { ...item, details } : item
        ));
        setItems(updatedItems);
    };

    const handleReset = () => {
        setItems(initialItems);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialItems));
    };

    const handleSave = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleSaveConfirm = () => {
        setShowModal(false);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        setShowAlert(true);
    };

    const handleTravelDaysChange = (e) => {
        const value = e.target.value;
        setTravelDays(value === "" ? 0 : Number(value));
    };

    return (
        <Container>
            <h2>여행 준비물 체크리스트</h2>
            <Form.Group controlId="isInternational">
                <Form.Label>여행 타입:</Form.Label>
                <Form.Check
                    type="switch"
                    label={isInternational ? "해외" : "국내"}
                    checked={isInternational}
                    onChange={() => setIsInternational(!isInternational)}
                />
            </Form.Group>
            <Form.Group controlId="travelDays">
                <Form.Label>여행 일수:</Form.Label>
                <Form.Control
                    type="number"
                    value={travelDays}
                    onChange={handleTravelDaysChange}
                    min="1"
                />
            </Form.Group>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>체크</th>
                        <th>카테고리</th>
                        <th>준비물</th>
                        <th>수량</th>
                        <th>세부사항</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {getFilteredItems().map(item => (
                        <tr key={item.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleCheckChange(item.id)}
                                />
                            </td>
                            <td>{item.category}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={item.details || ''}
                                    onChange={(e) => handleDetailChange(item.id, e.target.value)}
                                    placeholder="세부사항 입력"
                                />
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveItem(item.id)}>삭제</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form.Group controlId="newItemCategory">
                <Form.Label>새로운 준비물 카테고리:</Form.Label>
                <Form.Control
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="newItemName">
                <Form.Label>새로운 준비물 이름:</Form.Label>
                <Form.Control
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" onClick={handleAddItem}>항목 추가</Button>
            <Button variant="success" onClick={handleSave}>체크리스트 저장</Button>
            <Button variant="warning" onClick={handleReset}>초기화</Button>

            {/* 저장 확인 모달 */}
            <Modal show={showModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>저장하시겠습니까?</Modal.Title>
                </Modal.Header>
                <Modal.Body>체크리스트를 저장하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>취소</Button>
                    <Button variant="primary" onClick={handleSaveConfirm}>저장</Button>
                </Modal.Footer>
            </Modal>

            {/* 저장 완료 모달 */}
            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>저장 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body>체크리스트가 저장되었습니다.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowAlert(false)}>확인</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default TravelChecklist;
