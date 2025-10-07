// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo2 from "../assets/images/logo2.png";
import Logo from "../assets/images/logo.png";
import SelectList from "../components/SelectList";
import OtpInput from "../components/otp-input";

export default function ForgotPassword() {
  const [email, setUsername] = useState("");
  const [isSentCode, setIsSentCode] = useState(true);
  const [opt, setOpt] = useState(null);
  const navigate = useNavigate();

  const handleSendOpt = (e) => {
    e.preventDefault();
    setIsSentCode(true);
  };

  const handleVerifyOpt = (e) => {
  console.log(opt)
    e.preventDefault();
    if (opt) {
      navigate("/reset-password");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Left side with logo and tagline - hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <img src={Logo2} alt="Logo" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side with registration form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#1c1c1e] p-6  sm:py-8 sm:px-12 rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <img src={Logo} alt="Logo" className="w-[300px]" />
            </div>
          </div>

          {isSentCode ? (
            <div>
              <h3 className="text-2xl font-semibold text-[#CEB46A] mb-2 text-center">
                Enter 4 Digit Code
              </h3>
              <p className="text-gray-400 text-center mb-6">
                Enter the 4 digits code that you received on you email.
              </p>
              <form onSubmit={handleVerifyOpt} className="space-y-4">
                <OtpInput onChange={(data) => setOpt(data)} />
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-[#CEB46A] mb-2 text-center">
                Forgot Password?
              </h3>
              <p className="text-gray-400 text-center mb-6">
                Enter your email for the verification process we will send 4
                digits code to your email.
              </p>
              <form onSubmit={handleSendOpt} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-white mb-1">
                    Email<span className="text-white">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
