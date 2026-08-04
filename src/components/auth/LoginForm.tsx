//Mohammed coded this
import React, { useState } from 'react';

//Ammar coded this
import InputField from '../common/InputField';

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
            <InputField
                id="stdIdInput"
                label="STD ID"
                type="text"
                placeholder="Enter your Student ID"
                value={stdId}
                onChange={(e) => setStdId(e.target.value)}
            />
            {/* Mohammed coded this */}
            <InputField
                id="passwordInput"
                label="Password"
                type="password"
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