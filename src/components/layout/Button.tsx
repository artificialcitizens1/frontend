import React from 'react';
import '../../styles/fonts.css';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gray';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  width?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  width = 'auto',
}) => {
  const baseStyles = "flex justify-center items-center transition-colors";
  
  const variantStyles = {
    primary: "bg-white hover:bg-white/90 text-black",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg",
    gray: "bg-[#C2C3C7] hover:bg-[#C2C3C7]/90 text-black",
  };

  const sizes = {
    auto: "px-[88px] py-5",
    full: "w-full px-[88px] py-5",
  };

  const widthClass = width === 'full' ? sizes.full : sizes.auto;

  const textStyles = {
    primary: {
      fontFamily: "Roboto Mono",
      fontWeight: 500,
      fontSize: "28px",
      lineHeight: "37px",
      letterSpacing: "0%"
    },
    secondary: {
      fontFamily: "Roboto Mono",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "100%",
      letterSpacing: "0%"
    },
    gray: {
      fontFamily: "Roboto Mono",
      fontWeight: 500,
      fontSize: "28px",
      lineHeight: "37px",
      letterSpacing: "0%"
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${widthClass}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <span style={textStyles[variant]}>Loading...</span>
      ) : (
        <span style={textStyles[variant]}>
          {children}
        </span>
      )}
    </button>
  );
};

export default Button; 