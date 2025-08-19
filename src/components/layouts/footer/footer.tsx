import FooterStyles from './footer.module.scss';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: FC = () => {
    return (
        <>
            <footer className={`${FooterStyles.footer}`}>
                <div className={`${FooterStyles['footer-container']}`}>
                    <p className={`${FooterStyles['copyright-text']}`}>Copyright © 2025 Gamma | All Rights Reserved</p>
                    <ul className={`${FooterStyles['social-media-links']}`}>
                        <li>
                            <Link href="/">
                                <Image src={'/icons/facebook.svg'} alt="icons-facebook" width={12} height={12} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <Image src={'/icons/twitter.svg'} alt="icons-twitter" width={12} height={12} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <Image src={'/icons/instagram.svg'} alt="icons-instagram " width={12} height={12} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <Image src={'/icons/linkedIn.svg'} alt="icons-linkedIn " width={12} height={12} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <Image src={'/icons/youtube.svg'} alt="icons-youtube" width={12} height={12} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    );
};

export default Footer;
