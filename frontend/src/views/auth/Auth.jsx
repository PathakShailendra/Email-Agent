import React from 'react'
import './Auth.css'

const Auth = () => {
    const handleGoogleSignIn = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
    }
  return (
    <main className='auth-main'>
        <section className='auth-section'>
            <button onClick={handleGoogleSignIn} className="continue-with-google">Continue with Google</button>
        </section>
    </main>
  )
}

export default Auth