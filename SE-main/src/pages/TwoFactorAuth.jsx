// src/pages/TwoFactorAuth.jsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo2 from "../assets/images/logo2.png";
import Logo from "../assets/images/logo.png";

export default function TwoFactorAuth() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    
    console.log(code, code.length)
    if (code && code.length === 6) {
      // Verify code logic would go here
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Left side with logo and tagline - hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <img src={Logo2} alt="Logo"/>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with 2FA form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#1c1c1e] p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <img src={Logo} alt="Logo" className="w-[300px]"/>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#ceb46a] text-center mb-8">Two-Factor Authentication</h1>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-white mb-2 text-lg">Enter 2FA Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full py-3 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
                maxLength={6}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
              >
                Verify Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}