import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const LOCAL_STORAGE_KEY = 'travelChecklist';
const TRAVEL_DAYS_KEY = 'travelDays';

const initialItems = [
    // 의류
    { id: 1, category: '의류', name: '티셔츠', quantity: 3, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },
    { id: 2, category: '의류', name: '바지', quantity: 2, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },
    { id: 3, category: '의류', name: '속옷', quantity: 4, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },
    { id: 4, category: '의류', name: '양말', quantity: 4, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },
    { id: 5, category: '의류', name: '잠옷', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 6, category: '의류', name: '겉옷', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },

    // 전자기기
    { id: 7, category: '전자기기', name: '휴대폰 충전기', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 8, category: '전자기기', name: '보조 배터리', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 9, category: '전자기기', name: '카메라', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },

    // 세면도구
    { id: 10, category: '세면도구', name: '칫솔', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 11, category: '세면도구', name: '치약', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 12, category: '세면도구', name: '샴푸', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 13, category: '세면도구', name: '바디워시', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 14, category: '세면도구', name: '수건', quantity: 2, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },

    // 서류
    { id: 15, category: '서류', name: '신분증', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 16, category: '서류', name: '여권', quantity: 1, checked: false, isInternationalOnly: true, isDynamic: false, dailyQuantity: 0 },
    { id: 17, category: '서류', name: '비자', quantity: 1, checked: false, isInternationalOnly: true, isDynamic: false, dailyQuantity: 0 },
    { id: 18, category: '서류', name: 'e-티켓', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 19, category: '서류', name: '여행자보험 증서', quantity: 1, checked: false, isInternationalOnly: true, isDynamic: false, dailyQuantity: 0 },
    { id: 20, category: '서류', name: '국제운전면허증', quantity: 1, checked: false, isInternationalOnly: true, isDynamic: false, dailyQuantity: 0 },
    { id: 21, category: '서류', name: '예약 확인서', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },

    // 기타
    { id: 22, category: '기타', name: '여행용 어댑터', quantity: 1, checked: false, isInternationalOnly: true, isDynamic: false, dailyQuantity: 0 },
    { id: 23, category: '기타', name: '여행 가이드북', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 24, category: '기타', name: '응급 약품', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 25, category: '기타', name: '마스크', quantity: 5, checked: false, isInternationalOnly: false, isDynamic: true, dailyQuantity: 1 },
    { id: 26, category: '기타', name: '손 소독제', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 27, category: '기타', name: '여행용 세면도구 세트', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 28, category: '기타', name: '멀티탭', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 29, category: '기타', name: '휴대용 우산', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
    { id: 30, category: '기타', name: '여행용 슬리퍼', quantity: 1, checked: false, isInternationalOnly: false, isDynamic: false, dailyQuantity: 0 },
];

const predefinedCategories = ['의류', '전자기기', '세면도구', '서류', '기타'];

function TripChecklist() {
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedItems ? JSON.parse(savedItems) : initialItems;
    });
    const [newItemName, setNewItemName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(predefinedCategories[0]);
    const [isInternational, setIsInternational] = useState(false);
    const [travelDays, setTravelDays] = useState(() => {
        const savedDays = localStorage.getItem(TRAVEL_DAYS_KEY);
        return savedDays ? parseInt(savedDays) : 1;
    });
    const [newItemDailyQuantity, setNewItemDailyQuantity] = useState(1);

    const getFilteredItems = () => {
        const filteredItems = items.filter(item => {
            return isInternational ? true : !item.isInternationalOnly;
        });
        
        return filteredItems.sort((a, b) => {
            const categoryOrder = predefinedCategories.indexOf(a.category) - predefinedCategories.indexOf(b.category);
            if (categoryOrder !== 0) return categoryOrder;
            return a.name.localeCompare(b.name);
        }).map(item => ({
            ...item,
            quantity: item.isDynamic ? Math.ceil(item.dailyQuantity * travelDays) : item.quantity
        }));
    };

    const handleToggleCheck = (id) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleDailyQuantityChange = (id, value) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, dailyQuantity: Math.max(0, Math.round(value)) } : item
        ));
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleAddItem = () => {
        if (newItemName) {
            const newItem = {
                id: Date.now(),
                category: selectedCategory,
                name: newItemName,
                quantity: 1,
                checked: false,
                isInternationalOnly: false,
                isDynamic: true,
                dailyQuantity: newItemDailyQuantity
            };
            
            setItems([...items, newItem]);
            setNewItemName("");
            setNewItemDailyQuantity(1);
        }
    };

    const handleSave = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(TRAVEL_DAYS_KEY, travelDays.toString());
        alert('체크리스트가 저장되었습니다.');
    };

    const handleReset = () => {
        if (window.confirm('정말로 체크리스트를 초기화하시겠습니까?')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            localStorage.removeItem(TRAVEL_DAYS_KEY);
            setItems(initialItems);
            setTravelDays(1);
            alert('체크리스트가 초기화되었습니다.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">여행 체크리스트</h1>
            
            <div className="mb-4">
                <label className="mr-2">
                    <input
                        type="checkbox"
                        checked={isInternational}
                        onChange={(e) => setIsInternational(e.target.checked)}
                        className="mr-1"
                    />
                    해외여행
                </label>
                <label className="mr-2">
                    여행 일수:
                    <input
                        type="number"
                        value={travelDays}
                        onChange={(e) => setTravelDays(Math.max(1, parseInt(e.target.value)))}
                        className="ml-1 w-16 p-1 border rounded"
                    />
                </label>
            </div>

            <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">완료</th>
                        <th className="py-2 px-4 border-b">카테고리</th>
                        <th className="py-2 px-4 border-b">항목</th>
                        <th className="py-2 px-4 border-b">수량</th>
                        <th className="py-2 px-4 border-b">하루 필요 개수</th>
                        <th className="py-2 px-4 border-b">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {getFilteredItems().map((item, index, array) => (
                        <React.Fragment key={item.id}>
                            {index === 0 || item.category !== array[index - 1].category ? (
                                <tr className="bg-gray-100">
                                    <td colSpan="6" className="py-2 px-4 font-bold">{item.category}</td>
                                </tr>
                            ) : null}
                            <tr className="border-b border-gray-200">
                                <td className="py-2 px-4">
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => handleToggleCheck(item.id)}
                                    />
                                </td>
                                <td className="py-2 px-4">{item.category}</td>
                                <td className="py-2 px-4">{item.name}</td>
                                <td className="py-2 px-4">
                                    {item.quantity}
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={item.dailyQuantity}
                                        onChange={(e) => handleDailyQuantityChange(item.id, parseInt(e.target.value))}
                                        className="w-16 p-1 border rounded"
                                        min="0"
                                        step="1"
                                    />
                                </td>
                                <td className="py-2 px-4">
                                    <FontAwesomeIcon 
                                        icon={faTrash}
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-black-500 hover:text-black-700 cursor-pointer"
                                    />
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="flex mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-2 p-2 border rounded"
                >
                    {predefinedCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="새 항목 이름"
                    className="mr-2 p-2 border rounded"
                />
                <input
                    type="number"
                    value={newItemDailyQuantity}
                    onChange={(e) => setNewItemDailyQuantity(Math.max(0, parseInt(e.target.value)))}
                    placeholder="하루 필요 개수"
                    className="mr-2 p-2 border rounded"
                    min="0"
                    step="1"
                />
                <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded">
                    추가
                </button>
            </div>

            <div className="flex justify-between">
                <button onClick={handleReset} className="bg-red-500 text-white p-2 rounded">
                    초기화
                </button>
                <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded">
                    저장
                </button>
            </div>
        </div>
    );
}

export default TripChecklist;