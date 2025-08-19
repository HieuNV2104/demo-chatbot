'use client';
import type { FC } from 'react';
import React from 'react';
import type { IChatItem } from '../type';
import style from './style.module.scss';

import { Markdown } from '@/components/base/markdown';
import ImageGallery from '@/components/base/image-gallery';

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
    imgSrcs?: string[];
};

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
    const userName = '';
    return (
        <div className={`${style['question-box']}`} key={id}>
            <div>
                <div className={`${style.question}`}>
                    <div className={`${style['question-child']}`}>
                        {imgSrcs && imgSrcs.length > 0 && <ImageGallery srcs={imgSrcs} />}
                        <Markdown content={content} />
                    </div>
                </div>
            </div>
            {useCurrentUserAvatar ? (
                <div className="w-10 h-10 shrink-0 leading-10 text-center mr-2 rounded-full bg-primary-600 text-white">
                    {userName?.[0].toLocaleUpperCase()}
                </div>
            ) : (
                <div className={`${style.questionIcon}`}></div>
            )}
        </div>
    );
};

export default React.memo(Question);
