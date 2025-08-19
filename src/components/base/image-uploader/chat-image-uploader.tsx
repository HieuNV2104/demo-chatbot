import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Uploader from './uploader';
import ImageLinkInput from './image-link-input';
import ImagePlus from '@/components/base/icons/line/image-plus';
import { TransferMethod } from '@/types/app';
import {
    PortalToFollowElem,
    PortalToFollowElemContent,
    PortalToFollowElemTrigger
} from '@/components/base/portal-to-follow-elem';
import Upload03 from '@/components/base/icons/line/upload-03';
import type { ImageFile, VisionSettings } from '@/types/app';

type UploadOnlyFromLocalProps = {
    onUpload: (imageFile: ImageFile) => void;
    disabled?: boolean;
    limit?: number;
};
const UploadOnlyFromLocal: FC<UploadOnlyFromLocalProps> = ({ onUpload, disabled, limit }) => {
    return (
        <Uploader onUpload={onUpload} disabled={disabled} limit={limit}>
            {(hovering) => (
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: hovering ? '#f3f4f6' : 'transparent'
                    }}
                >
                    <ImagePlus style={{ width: 16, height: 16, color: '#6b7280' }} />
                </div>
            )}
        </Uploader>
    );
};

type UploaderButtonProps = {
    methods: VisionSettings['transfer_methods'];
    onUpload: (imageFile: ImageFile) => void;
    disabled?: boolean;
    limit?: number;
};
const UploaderButton: FC<UploaderButtonProps> = ({ methods, onUpload, disabled, limit }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const hasUploadFromLocal = methods.find((method) => method === TransferMethod.local_file);

    const handleUpload = (imageFile: ImageFile) => {
        setOpen(false);
        onUpload(imageFile);
    };

    const handleToggle = () => {
        if (disabled) return;

        setOpen((v) => !v);
    };

    return (
        <PortalToFollowElem open={open} onOpenChange={setOpen} placement="top-start">
            <PortalToFollowElemTrigger onClick={handleToggle}>
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb'
                    }}
                >
                    <ImagePlus style={{ width: 16, height: 16, color: '#6b7280' }} />
                </div>
            </PortalToFollowElemTrigger>
            <PortalToFollowElemContent className="z-50">
                <div
                    style={{
                        padding: '8px',
                        width: '260px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '0.5px solid #e5e7eb',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
                    }}
                >
                    <ImageLinkInput onUpload={handleUpload} />
                    {hasUploadFromLocal && (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',
                                    paddingInline: '8px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#9ca3af'
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: '12px',
                                        width: '93px',
                                        height: '1px',
                                        background: 'linear-gradient(to left, #F3F4F6, transparent)'
                                    }}
                                />
                                OR
                                <div
                                    style={{
                                        marginLeft: '12px',
                                        width: '93px',
                                        height: '1px',
                                        background: 'linear-gradient(to right, #F3F4F6, transparent)'
                                    }}
                                />
                            </div>
                            <Uploader onUpload={handleUpload} limit={limit}>
                                {(hovering) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '32px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#155EEF',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: hovering ? '#EEF2FF' : 'transparent'
                                        }}
                                    >
                                        <Upload03 style={{ marginRight: '4px', width: '16px', height: '16px' }} />
                                        {t('common.imageUploader.uploadFromComputer')}
                                    </div>
                                )}
                            </Uploader>
                        </>
                    )}
                </div>
            </PortalToFollowElemContent>
        </PortalToFollowElem>
    );
};

type ChatImageUploaderProps = {
    settings: VisionSettings;
    onUpload: (imageFile: ImageFile) => void;
    disabled?: boolean;
};
const ChatImageUploader: FC<ChatImageUploaderProps> = ({ settings, onUpload, disabled }) => {
    const onlyUploadLocal =
        settings.transfer_methods.length === 1 && settings.transfer_methods[0] === TransferMethod.local_file;

    if (onlyUploadLocal) {
        return <UploadOnlyFromLocal onUpload={onUpload} disabled={disabled} limit={+settings.image_file_size_limit!} />;
    }

    return (
        <UploaderButton
            methods={settings.transfer_methods}
            onUpload={onUpload}
            disabled={disabled}
            limit={+settings.image_file_size_limit!}
        />
    );
};

export default ChatImageUploader;
