import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-hanken font-bold transition-all transition-duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
    
    const variants = {
      primary: 'bg-[#870012] text-white shadow-lg shadow-[#870012]/20 hover:bg-[#9d0015] hover:shadow-[#870012]/40',
      secondary: 'bg-[#141d23] text-white shadow-lg shadow-[#141d23]/20 hover:bg-black',
      outline: 'bg-white border-2 border-[#e5bdba] text-[#141d23] hover:border-[#870012] hover:text-[#870012]',
      ghost: 'bg-transparent text-[#5c403e] hover:bg-[#870012]/5 hover:text-[#870012]',
      danger: 'bg-red-50 text-[#ba1a1a] hover:bg-red-100 border border-red-100',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[14px]',
      md: 'px-6 py-2.5 text-[15px]',
      lg: 'px-8 py-3.5 text-[16px] tracking-wide',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
