import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading02 from '@/components/base/icons/line/loading-02';
import XClose from '@/components/base/icons/line/x-close';
import RefreshCcw01 from '@/components/base/icons/line/refresh-ccw-01';
import AlertTriangle from '@/components/base/icons/solid/alert-triangle';
import TooltipPlus from '@/components/base/tooltip-plus';
import type { ImageFile } from '@/types/app';
import { TransferMethod } from '@/types/app';
import ImagePreview from '@/components/base/image-uploader/image-preview';

type ImageListProps = {
    list: ImageFile[];
    readonly?: boolean;
    onRemove?: (imageFileId: string) => void;
    onReUpload?: (imageFileId: string) => void;
    onImageLinkLoadSuccess?: (imageFileId: string) => void;
    onImageLinkLoadError?: (imageFileId: string) => void;
};

const ImageList: FC<ImageListProps> = ({
    list,
    readonly,
    onRemove,
    onReUpload,
    onImageLinkLoadSuccess,
    onImageLinkLoadError
}) => {
    const { t } = useTranslation();
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const handleImageLinkLoadSuccess = (item: ImageFile) => {
        if (item.type === TransferMethod.remote_url && onImageLinkLoadSuccess && item.progress !== -1)
            onImageLinkLoadSuccess(item._id);
    };
    const handleImageLinkLoadError = (item: ImageFile) => {
        if (item.type === TransferMethod.remote_url && onImageLinkLoadError) onImageLinkLoadError(item._id);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {list.map((item) => (
                <div
                    key={item._id}
                    className="group"
                    style={{
                        position: 'relative',
                        marginRight: '4px',
                        border: '0.5px solid rgba(0,0,0,0.05)',
                        borderRadius: '8px'
                    }}
                >
                    {item.type === TransferMethod.local_file && item.progress !== 100 && (
                        <>
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    left: item.progress > -1 ? `${item.progress}%` : 0
                                }}
                            >
                                {item.progress === -1 && (
                                    <RefreshCcw01
                                        className="w-5 h-5 text-white"
                                        onClick={() => onReUpload && onReUpload(item._id)}
                                    />
                                )}
                            </div>
                            {item.progress > -1 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '14px',
                                        color: 'white',
                                        mixBlendMode: 'lighten',
                                        zIndex: 1
                                    }}
                                >
                                    {item.progress}%
                                </span>
                            )}
                        </>
                    )}
                    {item.type === TransferMethod.remote_url && item.progress !== 100 && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                zIndex: 1,
                                border: '1px solid',
                                background: item.progress === -1 ? '#FEF0C7' : 'rgba(0,0,0,0.16)',
                                borderColor: item.progress === -1 ? '#DC6803' : 'transparent'
                            }}
                        >
                            {item.progress > -1 && (
                                <Loading02
                                    className="animate-spin"
                                    style={{ width: '20px', height: '20px', color: 'white' }}
                                />
                            )}
                            {item.progress === -1 && (
                                <TooltipPlus popupContent={t('common.imageUploader.pasteImageLinkInvalid')}>
                                    <AlertTriangle style={{ width: '16px', height: '16px', color: '#DC6803' }} />
                                </TooltipPlus>
                            )}
                        </div>
                    )}
                    <img
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '0.5px solid rgba(0,0,0,0.05)'
                        }}
                        alt=""
                        onLoad={() => handleImageLinkLoadSuccess(item)}
                        onError={() => handleImageLinkLoadError(item)}
                        src={item.type === TransferMethod.remote_url ? item.url : item.base64Url}
                        onClick={() =>
                            item.progress === 100 &&
                            setImagePreviewUrl(
                                (item.type === TransferMethod.remote_url ? item.url : item.base64Url) as string
                            )
                        }
                    />
                    {!readonly && (
                        <div
                            className={item.progress === -1 ? '' : 'group-hover'}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                top: '-9px',
                                right: '-9px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '18px',
                                height: '18px',
                                background: 'white',
                                border: '0.5px solid rgba(0,0,0,0.02)',
                                borderRadius: '20px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                cursor: 'pointer'
                            }}
                            onClick={() => onRemove && onRemove(item._id)}
                        >
                            <XClose style={{ width: '12px', height: '12px', color: '#6b7280' }} />
                        </div>
                    )}
                </div>
            ))}
            {imagePreviewUrl && <ImagePreview url={imagePreviewUrl} onCancel={() => setImagePreviewUrl('')} />}
        </div>
    );
};

export default ImageList;
