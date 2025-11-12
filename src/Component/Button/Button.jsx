import React from 'react';

const BUTTON_STYLES = {
  primary:
    'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 focus:ring-2 focus:ring-purple-200',
  secondary:
    'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-200',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200',
};

/**
 * Button 컴포넌트
 * @param {'primary' | 'secondary' | 'ghost'} variant
 * @param {string} size - 'lg' | 'md' | 'sm'
 * @param {boolean} fullWidth
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {boolean} disabled
 */
const ICONS = {
  'arrow-left': (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 18L8 12L14 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'arrow-right': (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6L16 12L10 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left',
  ...rest
}) {
  const sizeClass =
    size === 'lg'
      ? 'h-14 px-6 text-18-bold rounded-xl'
      : size === 'sm'
      ? 'h-9 px-4 text-14-bold rounded-lg'
      : 'h-10 px-5 text-16-bold rounded-lg';

  const widthClass = fullWidth ? 'w-full' : 'w-auto';
  const iconNode = icon ? ICONS[icon] : null;
  const content = iconNode ? (
    <span
      className={`flex items-center gap-2 ${
        iconPosition === 'right' ? 'flex-row-reverse' : ''
      }`}
    >
      {iconNode}
      <span>{children}</span>
    </span>
  ) : (
    children
  );

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center 
        gap-2 transition-colors duration-150
        ${BUTTON_STYLES[variant] ?? BUTTON_STYLES.primary}
        ${sizeClass}
        ${widthClass}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;