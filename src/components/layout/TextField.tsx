import React, { forwardRef } from 'react';
import type { TextareaHTMLAttributes, InputHTMLAttributes, CSSProperties } from 'react';
import '../../styles/fonts.css';

type TextFieldBaseProps = {
  label: string;
  error?: string;
  multiline?: boolean;
  className?: string;
};

type TextFieldInputProps = TextFieldBaseProps & InputHTMLAttributes<HTMLInputElement>;
type TextFieldTextareaProps = TextFieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
type TextFieldProps = TextFieldInputProps | TextFieldTextareaProps;

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ label, error, multiline = false, className = '', ...props }, ref) => {
    const labelStyles: CSSProperties = {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '24px',
      lineHeight: '32px',
      color: '#FFFFFF',
      opacity: 0.8,
      width: '100%',
    };

    const inputStyles: CSSProperties = {
      width: '100%',
      height: multiline ? '138px' : '67px',
      background: '#12182F',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxSizing: 'border-box',
      padding: '19px 26px',
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '22px',
      lineHeight: '29px',
      color: '#FFFFFF',
      textAlign: 'left',
      maxWidth: '100%',
    };

    const containerStyles: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '11px',
      width: '100%',
      maxWidth: '100%',
    };

    return (
      <div style={containerStyles} className={className}>
        <label style={labelStyles}>
          {label}
        </label>
        
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            style={inputStyles}
            className="resize-none focus:outline-none w-full"
            {...(props as TextFieldTextareaProps)}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            style={inputStyles}
            className="focus:outline-none w-full"
            {...(props as TextFieldInputProps)}
          />
        )}
        
        {error && (
          <p className="text-red-500 mt-1 w-full" style={{ fontFamily: "Roboto Mono" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField; 