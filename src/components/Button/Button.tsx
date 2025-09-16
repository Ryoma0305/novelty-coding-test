import type { FC, ReactNode } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small' | 'large';
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  href,
  variant = 'primary',
  size = 'default',
  rounded = false,
  className = '',
  onClick,
  children,
}) => {
  const baseClass = styles.btnArrow;
  const variantClass = rounded
    ? variant === 'secondary'
      ? styles.btnArrowSecondaryRounded
      : styles.btnArrowPrimaryRounded
    : variant === 'secondary'
      ? styles.btnArrowSecondary
      : styles.btnArrowPrimary;
  const sizeClass =
    size === 'small'
      ? styles.btnArrowSmall
      : size === 'large'
        ? styles.btnArrowLarge
        : '';
  const classes = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  const icon = (
    <span className={styles.btnArrowIcon}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2 1.95508H12M12 1.95508V11.9551M12 1.95508L2 11.9551"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
      {icon}
    </button>
  );
};
