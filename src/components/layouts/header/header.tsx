'use client';

import { FC } from 'react';
import Image from 'next/image';
import HeaderStyles from './header.module.scss';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { signout } from '@/app/login/actions';

const Header: FC = () => {
    const { isLogin, setLogin } = useAuthStore();

    const handleLogout = async () => {
        const rs = await signout();
        if (rs) {
            setLogin(false);
        }
    };

    return (
        <>
            <header className={`${HeaderStyles.header}`}>
                <Link href={'/'} className={`${HeaderStyles['logo-brand']}`}>
                    <Image src={'/images/logo.png'} alt="logo" width={73} height={73} />
                    <div className={`${HeaderStyles['brand-text']}`}>
                        <h1 className={`${HeaderStyles['brand-title']}`}>SỞ KHOA HỌC VÀ CÔNG NGHỆ HÀ NỘI</h1>
                        <p className={`${HeaderStyles['brand-subtitle']}`}>
                            Trang AI Hỏi đáp – Tra cứu chính sách KH&CN
                        </p>
                    </div>
                </Link>
                <nav className={`${HeaderStyles['auth-nav']}`}>
                    {isLogin ? (
                        <button type="button" onClick={handleLogout} className={`${HeaderStyles['btn-login']}`}>
                            Đăng xuất
                        </button>
                    ) : (
                        <>
                            <Link href={'/login'} className={`${HeaderStyles['btn-login']}`}>
                                Đăng nhập
                            </Link>
                            <Link href={'/login'} className={`${HeaderStyles['btn-register']}`}>
                                Đăng ký
                            </Link>
                        </>
                    )}
                </nav>
            </header>
        </>
    );
};

export default Header;
