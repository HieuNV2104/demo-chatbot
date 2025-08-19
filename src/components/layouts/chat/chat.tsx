/* eslint-disable @next/next/no-img-element */
'use client';

import ChatStyles from './chat.module.scss';
import React, { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Answer from './answer';
import Question from './question';
import type { FeedbackFunc } from './type';
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app';
import { Resolution } from '@/types/app';
import { TransferMethod } from '@/types/app';
import Toast from '@/components/base/toast';
import ChatImageUploader from '@/components/base/image-uploader/chat-image-uploader';
import ImageList from '@/components/base/image-uploader/image-list';
import { useImageFiles } from '@/components/base/image-uploader/hooks';
import { v4 } from 'uuid';
export type IChatProps = {
    chatList: ChatItem[];
    /**
     * Whether to display the editing area and rating status
     */
    feedbackDisabled?: boolean;
    /**
     * Whether to display the input area
     */
    isHideSendInput?: boolean;
    onFeedback?: FeedbackFunc;
    checkCanSend?: () => boolean;
    onSend?: (message: string, files: VisionFile[]) => void;
    useCurrentUserAvatar?: boolean;
    isResponding?: boolean;
    controlClearQuery?: number;
    visionConfig?: VisionSettings;
};

const Chat: FC<IChatProps> = ({
    chatList,
    feedbackDisabled = false,
    isHideSendInput = false,
    onFeedback,
    checkCanSend,
    onSend = () => {},
    useCurrentUserAvatar,
    isResponding,
    controlClearQuery,
    visionConfig
}) => {
    const [heightInput, setHeightInput] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation();
    const { notify } = Toast;
    const isUseInputMethod = useRef(false);
    const initAnswer = {
        content: 'Chào bạn! Mình là nhân viên hỗ trợ dịch vụ công. Bạn đang cần hỗ trợ về vấn đề gì ạ?',
        feedbackDisabled: true,
        id: v4(),
        isAnswer: true,
        isOpeningStatement: false,
        suggestedQuestions: []
    };

    const [query, setQuery] = React.useState('');
    const queryRef = useRef('');

    const handleContentChange = (e: any) => {
        const value = e.target.value;
        setQuery(value);
        queryRef.current = value;
    };

    const logError = (message: string) => {
        notify({ type: 'error', message, duration: 3000 });
    };

    const valid = () => {
        const query = queryRef.current;
        const hasImages = files.filter((file) => file.progress !== -1).length > 0;
        if ((!query || query.trim() === '') && !hasImages) {
            logError(t('app.errorMessage.valueOfVarRequired'));
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (controlClearQuery) {
            setQuery('');
            queryRef.current = '';
        }
    }, [controlClearQuery]);
    const { files, onUpload, onRemove, onReUpload, onImageLinkLoadError, onImageLinkLoadSuccess, onClear } =
        useImageFiles();

    const effectiveVisionSettings: VisionSettings = {
        enabled: true,
        number_limits: 2,
        detail: Resolution.low,
        transfer_methods: [TransferMethod.local_file],
        image_file_size_limit: 15
    };
    const handleSend = () => {
        if (!valid() || (checkCanSend && !checkCanSend())) return;
        onSend(
            queryRef.current,
            files
                .filter((file) => file.progress !== -1)
                .map((fileItem) => ({
                    type: 'image',
                    transfer_method: fileItem.type,
                    url: fileItem.url,
                    upload_file_id: fileItem.fileId
                }))
        );
        if (!files.find((item) => item.type === TransferMethod.local_file && !item.fileId)) {
            if (files.length) onClear();
            if (!isResponding) {
                setQuery('');
                queryRef.current = '';
            }
        }
    };

    const handleKeyUp = (e: any) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            // prevent send message when using input method enter
            if (!e.shiftKey && !isUseInputMethod.current) handleSend();
        }
    };

    const handleKeyDown = (e: any) => {
        isUseInputMethod.current = e.nativeEvent.isComposing;
        if (e.code === 'Enter' && !e.shiftKey) {
            const result = query.replace(/\n$/, '');
            setQuery(result);
            queryRef.current = result;
            e.preventDefault();
        }
    };

    const suggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        queryRef.current = suggestion;
        handleSend();
    };

    useEffect(() => {
        const maxHeight = 14 * 1.5 * 3;
        const textarea = textAreaRef.current;
        if (!textarea) return;
        textarea.style.height = 'auto';
        if (textarea.scrollHeight <= maxHeight) {
            textarea.style.overflowY = 'hidden';
            textarea.style.height = `${textarea.scrollHeight}px`;
        } else {
            textarea.style.overflowY = 'auto';
            textarea.style.height = `${maxHeight}px`;
        }
    }, [heightInput]);

    return (
        <>
            <section className={`${ChatStyles['chat']}`}>
                <h2>Hỏi trợ lý AI của chúng tôi</h2>
                <div className={`${ChatStyles['chat-box']}`}>
                    {chatList.length === 0 && (
                        <Answer
                            key={initAnswer.id}
                            item={initAnswer}
                            feedbackDisabled={feedbackDisabled}
                            onFeedback={onFeedback}
                            isResponding={isResponding}
                            suggestionClick={suggestionClick}
                        />
                    )}
                    {chatList.map((item) => {
                        if (item.isAnswer) {
                            const isLast = item.id === chatList[chatList.length - 1].id;
                            return (
                                <Answer
                                    key={item.id}
                                    item={item}
                                    feedbackDisabled={feedbackDisabled}
                                    onFeedback={onFeedback}
                                    isResponding={isResponding && isLast}
                                    suggestionClick={suggestionClick}
                                />
                            );
                        }
                        return (
                            <Question
                                key={item.id}
                                id={item.id}
                                content={item.content}
                                useCurrentUserAvatar={useCurrentUserAvatar}
                                imgSrcs={
                                    item.message_files && item.message_files?.length > 0
                                        ? item.message_files.map((item) => item.url)
                                        : []
                                }
                            />
                        );
                    })}
                </div>
                <form action="" className={`${ChatStyles['chat-input-container']}`}>
                    <textarea
                        ref={textAreaRef}
                        name=""
                        id=""
                        placeholder="|Đặt bất cư câu hỏi nào bạn muốn"
                        onChange={(e) => setHeightInput(e.target.value)}
                        value={query}
                        onInput={handleContentChange}
                        onKeyUp={handleKeyUp}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                    {files.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                            <ImageList
                                list={files}
                                onRemove={onRemove}
                                onReUpload={onReUpload}
                                onImageLinkLoadError={onImageLinkLoadError}
                                onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                            />
                        </div>
                    )}
                    <div className={`${ChatStyles['chat-controls']}`}>
                        <div className={`${ChatStyles['chat-actions']}`}>
                            <button type="button">
                                <img src={'/icons/left.svg'} alt="icon-left" width={20} height={20} />
                            </button>
                            <button type="button">
                                <img src={'/icons/right.svg'} alt="icon-right" width={20} height={20} />
                            </button>
                            <button type="button">
                                <Image src={'/icons/link.svg'} alt="icon-link" width={20} height={20} />
                            </button>
                            {effectiveVisionSettings.enabled && (
                                <>
                                    <ChatImageUploader
                                        settings={effectiveVisionSettings}
                                        onUpload={onUpload}
                                        disabled={!!isResponding}
                                    />
                                </>
                            )}
                        </div>
                        <div className={`${ChatStyles['chat-actions']}`}>
                            <button type="button">
                                <img src={'/icons/mic.svg'} alt="icon-mic" width={20} height={20} />
                            </button>
                            <button className={`${ChatStyles.send}`} type="button" onClick={handleSend}>
                                Gửi
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};
export default Chat;
