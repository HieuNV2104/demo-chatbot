'use client';

import HistoryChatStyles from './history-chat.module.scss';
import { FC, useState, useEffect } from 'react';
import Image from 'next/image';

const tabs = ['Mới nhất', 'Đã lưu', 'Thông tư', 'Luật', 'Chính sách'];

interface HistoryChatItem {
    agent_thoughts: any;
    answer: string;
    conversation_id: string;
    created_at: number;
    error: null | any;
    feedback: null | any;
    id: string;
    inputs: any;
    message_files: any;
    parent_message_id: string;
    query: string;
    retriever_resources: any;
    status: 'normal';
}

interface HistoryChatProps {
    data: {
        data: HistoryChatItem[];
        has_more: boolean;
        limit: number;
    };
}

const HistoryChat: FC<HistoryChatProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const handleToggleContent = (index: number) => {
        setExpandedItems((prev) => {
            if (prev.includes(index)) {
                return prev.filter((item) => item !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    return (
        <>
            <section className={`${HistoryChatStyles['history-chat']}`}>
                <div className={`${HistoryChatStyles['history-chat-header']}`}>
                    <h2 className={`${HistoryChatStyles['history-chat-title']}`}>Lịch sử trò chuyện</h2>
                    <p className={`${HistoryChatStyles['history-chat-subtitle']}`}>
                        Bạn có thể tìm lại các cuộc trò truyện cũ, luật, thông tư nhiều người quan tâm dưới đây nhé.
                    </p>
                </div>
                <ul className={`${HistoryChatStyles['tabs']}`}>
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={activeTab === index ? HistoryChatStyles.active : ''}
                            onClick={() => handleTabClick(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <div className={`${HistoryChatStyles['accordion']}`}>
                    {data?.data?.map((item, index) => {
                        const isExpanded = expandedItems.includes(index);
                        return (
                            <div key={index} className={`${HistoryChatStyles['accordion-item']}`}>
                                <button
                                    onClick={() => handleToggleContent(index)}
                                    className={`${HistoryChatStyles['accordion-header']}`}
                                >
                                    <span>{item.query}</span>
                                    <Image
                                        src={isExpanded ? '/icons/close.svg' : '/icons/plus.svg'}
                                        alt={isExpanded ? 'icon-close' : 'icon-plus'}
                                        width={16}
                                        height={16}
                                    />
                                </button>
                                {isExpanded && (
                                    <div className={`${HistoryChatStyles['accordion-content']}`}>
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
};

export default HistoryChat;
