import { cn } from '@lib/utils';


interface CheckBoxProps {
    type?: 'checkbox' | 'radio';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string | React.JSX.Element;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    name?: string;
    value?: string;
    contentClassName?: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
    type = 'checkbox',
    checked = false,
    onChange,
    label,
    disabled = false,
    className,
    labelClassName,
    size = 'md',
    name,
    value,
    contentClassName
}) => {
    const handleChange = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'xs':
                return 'w-4 h-4 flex-shrink-0';
            case 'sm':
                return 'w-4 h-4 flex-shrink-0';
            case 'md':
                return 'w-[22px] h-[22px] flex-shrink-0';
            case 'lg':
                return 'w-6 h-6 flex-shrink-0';
            default:
                return 'w-5 h-5 flex-shrink-0';
        }
    };

    const getTextSizeClasses = () => {
        switch (size) {
            case 'xs':
                return 'text-xs';
            case 'sm':
                return 'text-sm';
            case 'md':
                return 'text-base';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const baseClasses = cn(
        getSizeClasses(),
        'border-2 cursor-pointer transition-all duration-200 flex items-center justify-center',
        disabled ? 'cursor-not-allowed' : 'hover:border-blue-400',
        className
    );

    const checkboxClasses = cn(
        baseClasses,
        'rounded-[4px]',
        disabled
            ? 'bg-gray-100 border-gray-200'
            : checked
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-white border-gray-300'
    );

    const radioClasses = cn(
        baseClasses,
        'rounded-full',
        disabled
            ? 'bg-gray-100 border-gray-200'
            : checked
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300'
    );

    return (
        <label className={cn('flex items-center gap-[6px] cursor-pointer', disabled && 'cursor-not-allowed', contentClassName)}>
            <div
                className={type === 'checkbox' ? checkboxClasses : radioClasses}
                onClick={handleChange}
            >
                {checked && type === 'checkbox' && (
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                {checked && type === 'radio' && (
                    <div className="w-[10px] h-[10px] bg-white rounded-full" />
                )}
            </div>

            {label && (
                <span
                    className={cn(
                        getTextSizeClasses(),
                        'text-gray-700 select-none',
                        disabled && 'text-gray-400',
                        labelClassName
                    )}
                    onClick={handleChange}
                >
                    {label}
                </span>
            )}

            <input
                type={type}
                checked={checked}
                onChange={() => { }}
                disabled={disabled}
                name={name}
                value={value}
                className="sr-only"
            />
        </label>
    );
};
