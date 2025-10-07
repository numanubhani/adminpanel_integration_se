import React, { useRef, useState, useEffect } from "react";

export default function OtpInput({ onChange }) {
  const length = 4;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, length);

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("");
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const focusIndex = digits.length < length ? digits.length : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-4 items-center justify-center w-full ">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-14 h-14 text-center bg-[#1c1c1e] text-white text-2xl font-bold outline-0 border rounded-md focus:border-2 focus:border-[#ceb46a] transition-all"
          aria-label={`Digit ${index + 1} of OTP`}
        />
      ))}
    </div>
  );
}
