//Mohammed coded this
import React, {type ReactNode } from 'react';

//Ammar coded this
interface BaseTextFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: ReactNode;
}

//Ammar coded this
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
                {/* Mohammed coded this */}
                <input
                    /* Ammar coded this */
                    type={type}
                    /* Mohammed coded this */
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                    /* Ammar coded this */
                    className="form-control form-control-lg bg-light border-0 pe-5"
                />

                {children}
            </div>
        </div>
    );
}