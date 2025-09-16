import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import styles from './Header.module.scss';

interface HeaderProps {
  isHome?: boolean;
}

interface MenuItem {
  label: string;
  href: string;
  size?: 'normal' | 'small';
}

const mainMenuItems: MenuItem[] = [
  { label: 'ノベルティについて', href: '#' },
  { label: 'ノベルティのカルチャー', href: '#' },
  { label: 'インタビュー', href: '#' },
  { label: 'ノベルティの日常', href: '#' },
  { label: '数字でみるノベルティ', href: '#' },
  { label: '福利厚生・制度', href: '#' },
];

const mobileMenuItems1: MenuItem[] = [
  { label: 'ホーム', href: '/' },
  { label: 'ノベルティについて', href: '#' },
  { label: 'ノベルティのカルチャー', href: '#' },
  { label: 'ストーリー', href: '#' },
  { label: '数字でみるノベルティ', href: '#' },
];

const mobileMenuItems2: MenuItem[] = [
  { label: '福利厚生・制度', href: '#' },
  { label: 'ノベルティの日常', href: '#' },
  { label: 'メンバー紹介', href: '#', size: 'small' },
  { label: '最近のできこと', href: '#', size: 'small' },
  { label: '福利厚生', href: '#', size: 'small' },
  { label: '社内環境', href: '#', size: 'small' },
  { label: 'レクリエーション', href: '#', size: 'small' },
];

export const Header: FC<HeaderProps> = ({ isHome = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    // フォーカスをハンバーガーボタンに戻す
    if (hamburgerButtonRef.current) {
      hamburgerButtonRef.current.focus();
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    // 少し遅延してから閉じるボタンにフォーカスを移動
    setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);
  };

  // Escapeキーでメニューを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // ボディのスクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // ウィンドウリサイズ時の処理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // フォーカストラップの実装
  useEffect(() => {
    if (!isMenuOpen || !mobileMenuRef.current) return;

    const mobileMenu = mobileMenuRef.current;
    const focusableElements = mobileMenu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    mobileMenu.addEventListener('keydown', trapFocus);
    return () => mobileMenu.removeEventListener('keydown', trapFocus);
  }, [isMenuOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.logo}>
            <a
              href="/"
              className={styles.logoLink}
              aria-label="株式会社ノベルティ ホームページ"
            >
              <img src="/images/logo.webp" alt="株式会社ノベルティ" />
            </a>
          </h1>
          <div className={styles.headerContent}>
            {/* デスクトップナビゲーション */}
            <nav className={styles.nav} aria-label="メインナビゲーション">
              <Button href="#" variant="primary">
                カジュアル面談
              </Button>
              <Button href="#" variant="primary">
                募集要項・エントリー
              </Button>
            </nav>
            {/* ハンバーガーメニューボタン */}
            <button
              ref={hamburgerButtonRef}
              type="button"
              className={styles.hamburger}
              aria-label={
                isMenuOpen
                  ? 'すべてのメニューを閉じる'
                  : 'すべてのメニューを開く'
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={isMenuOpen ? closeMenu : openMenu}
            >
              <span className={styles.hamburgerOpenIcon}>
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20 8H8M20 14H6M20 2H2"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.isOpen : ''}`}
          aria-hidden={!isMenuOpen}
          onClick={handleOverlayClick}
        >
          <nav className={styles.mobileNav} aria-label="モバイルナビゲーション">
            <div className={styles.mobileNavHeader}>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.mobileNavClose}
                aria-label="メニューを閉じる"
                onClick={closeMenu}
              >
                <span className={styles.hamburgerCloseIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 2L2 14M2 2L14 14"
                      stroke="#3730FF"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className={styles.mobileNavContent}>
              <div className={styles.mobileLogo}>
                <img src="/images/logo02.webp" alt="Novelty" />
              </div>
              <div className={styles.mobileNavContentInner}>
                <div className={styles.mobileNavLists}>
                  <ul className={styles.mobileNavList}>
                    {mobileMenuItems1.map((item, index) => (
                      <li
                        key={index}
                        className={`${styles.mobileNavItem}${item.size === 'small' ? ` ${styles.isSmall}` : ''}`}
                      >
                        <a
                          href={item.href}
                          className={styles.mobileNavLink}
                          onClick={handleLinkClick}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul
                    className={`${styles.mobileNavList} ${styles.mobileNavList02}`}
                  >
                    {mobileMenuItems2.map((item, index) => (
                      <li
                        key={index}
                        className={`${styles.mobileNavItem}${item.size === 'small' ? ` ${styles.isSmall}` : ''}`}
                      >
                        <a
                          href={item.href}
                          className={styles.mobileNavLink}
                          onClick={handleLinkClick}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.mobileNavButtons}>
                  <Button
                    href="#"
                    variant="secondary"
                    onClick={handleLinkClick}
                  >
                    カジュアル面談
                  </Button>
                  <Button
                    href="#"
                    variant="secondary"
                    onClick={handleLinkClick}
                  >
                    募集要項・エントリー
                  </Button>
                </div>
              </div>

              <div className={styles.mobileNavLinks}>
                <Button
                  href="#"
                  variant="primary"
                  rounded={true}
                  size="small"
                  onClick={handleLinkClick}
                >
                  コーポレートサイト
                </Button>
                <Button
                  href="#"
                  variant="primary"
                  rounded={true}
                  size="small"
                  onClick={handleLinkClick}
                >
                  ノベルティ公式X
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* サイドナビゲーション */}
      <nav className={styles.sideNav} aria-label="サイドナビゲーション">
        <ul className={styles.sideNavList}>
          {mainMenuItems.map((item, index) => (
            <li key={index} className={styles.sideNavItem}>
              <a href={item.href} className={styles.sideNavLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
