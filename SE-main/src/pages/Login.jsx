import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../Instance";
import Logo2 from "../assets/images/logo2.png";
import Logo from "../assets/images/logo.png";
import SelectList from "../components/SelectList";
import { TbLogout2 } from "react-icons/tb";

const roles = [
  { label: "Content Contributor", value: "Content Contributor" },
  { label: "User", value: "Judge" },
];

export default function Login() {
  const [email, setUsername] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const resp = await fetch(`${BASE_URL}accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) throw new Error("Login failed");
    const { access, profile } = await resp.json();
    localStorage.setItem("auth", "true");
    localStorage.setItem("token", access);
    localStorage.setItem("username", email);
    localStorage.setItem("role", profile.role);

    if (profile.role === "user") {
      navigate("/dashboard");
    } else if (profile.role === "contributor") {
      navigate("/creator-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    alert("Login failed. Check your email/password.");
  }
};

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <div className="hidden md:flex flex-1 flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <img src={Logo2} alt="Logo" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#1c1c1e] p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="w-[300px]" />
          </div>

          <h3 className="text-2xl font-semibold text-[#CEB46A] text-center mb-6">
            Login
          </h3>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-white mb-1">
                Password<span className="text-white">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a href="/forgot-password" className="text-[#ceb46a] text-sm mb-1">
                  Forgot Password?
                </a>
              </div>
            </div>

            <SelectList
              className="border"
              buttonClassName="bg-transparent"
              label=""
              options={roles}
              value={role}
              onChange={setRole}
            />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#ceb46a]">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
