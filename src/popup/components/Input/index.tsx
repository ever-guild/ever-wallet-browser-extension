import React from 'react'

import './style.scss'

interface ISimpleInput {
    className?: string
    label?: string
    autoFocus?: boolean
    disabled?: boolean
    type?:
        | 'text'
        | 'none'
        | 'tel'
        | 'url'
        | 'email'
        | 'numeric'
        | 'decimal'
        | 'search'
        | 'password'
        | undefined
    register?: any
    name?: string
    autocomplete?: string
    pattern?: string
    inputMode?:
        | 'text'
        | 'none'
        | 'tel'
        | 'url'
        | 'email'
        | 'numeric'
        | 'decimal'
        | 'search'
        | undefined
    min?: string
    value?: string
    readOnly?: boolean
    id?: string
    onChange?: (value: string) => void
}

const Input: React.FC<ISimpleInput> = ({
    className,
    label,
    autoFocus = false,
    disabled,
    type = 'number',
    register,
    name = '',
    autocomplete = 'off',
    pattern = undefined,
    inputMode = undefined,
    min = undefined,
    value = undefined,
    readOnly = false,
    id,
    onChange,
}) => {
    return (
        <input
            className={`simple-input ${className || ''}`}
            readOnly={readOnly}
            name={name}
            id={id}
            ref={register}
            autoFocus={autoFocus}
            disabled={disabled}
            placeholder={label}
            type={type}
            autoComplete={autocomplete}
            pattern={pattern}
            inputMode={inputMode}
            min={min}
            step={0.000000000000000001}
            value={value}
            onChange={(e) => {
                onChange?.(e.target.value)
            }}
        />
    )
}
export default Input