//Mohammed coded this
import React, { useState } from 'react';

//Ammar coded this
import BaseTextField from '../common/BaseTextField';
import PasswordField from '../common/PasswordField';

//Mohammed coded this
export default function LoginForm() {
    //Ammar coded this
    const [stdId, setStdId] = useState("");

    //Mohammed coded this
    const [password, setPassword] = useState("");

    //Mohammed coded this
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //Ammar coded this
        console.log('Login attempt:', { stdId, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Ammar coded this */}
            <BaseTextField
                id="stdIdInput"
                label="STD ID"
                type="text"
                placeholder="Enter your Student ID"
                value={stdId}
                onChange={(e) => setStdId(e.target.value)}
            />
            {/* Mohammed coded this */}
            <PasswordField
                id="passwordInput"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Ammar coded this */}
            <div className="mt-4">

                {/* Mohammed coded this */}
                <button
                    type="submit"
                    /* Ammar coded this */
                    className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3"
                >
                    Sign In
                </button>
            </div>
        </form>
    );
}