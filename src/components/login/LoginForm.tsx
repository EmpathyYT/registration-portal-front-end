import React, { useState } from 'react';

import BaseTextField from './BaseTextField.tsx';
import PasswordField from './PasswordField.tsx';

export default function LoginForm() {
    const [UniId, setStdId] = useState("");

    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { UniId, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <BaseTextField
                id="stdIdInput"
                label="UNI ID"
                type="text"
                placeholder="Enter your University ID"
                value={UniId}
                onChange={(e) => setStdId(e.target.value)}
            />
            <PasswordField
                id="passwordInput"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mt-4">

                <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3"
                >
                    Sign In
                </button>
            </div>
        </form>
    );
}