'use client';

import React, { useState } from 'react';
import { login, signup } from './actions';
import style from './style.module.scss';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const { setLogin } = useAuthStore();
    const [data, setData] = useState<{ email: string; password: string }>({ email: '', password: '' });
    // handle change data
    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };
    // handle login
    const handleLogin = async () => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        const user = await login(formData);
        if (user) {
            setLogin(true);
            router.push('/');
        }
    };
    // handle signup
    const handleSignup = async () => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        const user = await signup(formData);
        if (user) {
            setLogin(true);
            router.push('/');
        }
    };

    return (
        <form className={`${style.login}`} method="post" action="">
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required onChange={handleData} />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required onChange={handleData} />
            <div>
                <button type="button" onClick={handleLogin}>
                    Log in
                </button>
                <button type="button" onClick={handleSignup}>
                    Sign up
                </button>
            </div>
        </form>
    );
}
