import React, {type ReactNode } from 'react';

interface BaseTextFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: ReactNode;
}

export default function BaseTextField(
    {
        id,
        label,
        type = 'text',
        placeholder,
        value,
        onChange,
        children
    }: BaseTextFieldProps) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label fw-semibold text-secondary">
                {label}
            </label>

            <div className="position-relative">
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                    className="form-control form-control-lg bg-light border-0 pe-5"
                />

                {children}
            </div>
        </div>
    );
}