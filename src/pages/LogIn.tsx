//Mohammed coded this
import React from 'react';

//Ammar coded this
import LoginForm from '../components/auth/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';

//Mohammed coded this
export default function LogIn() {
    return (
        //Ammar coded this
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f4f7f6' }}>
            <div className="card shadow-lg p-5 border-0 rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
                <div className="text-center mb-4">

                    {/* Mohammed coded this */}
                    <h2
                        /* Ammar coded this */
                        className="fw-bolder text-primary mb-2"
                    >
                        Student Portal
                    </h2>

                    {/* Mohammed coded this */}
                    <p

                        className="text-muted small"
                    >
                        Enter your student information to access the Student Portal.
                    </p>
                </div>

                {/* Ammar coded this */}
                <LoginForm />
            </div>
        </div>
    );
}