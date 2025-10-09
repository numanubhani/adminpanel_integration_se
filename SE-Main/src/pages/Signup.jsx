import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo2 from "../assets/images/logo2.png";
import Logo from "../assets/images/logo.png";
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const BASE_URL = "https://selectexposure.pythonanywhere.com/api/"; // Django API base URL

export default function Signup() {
  // Add step state to track the current form step
  const [currentStep, setCurrentStep] = useState(1);
  const [showFundsPopup, setShowFundsPopup] = useState(false);
  const [showCreatorPathwayPopup, setShowCreatorPathwayPopup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    creatorPathway: "",
    agreeToTerms: false,
    screenName: "",
    legalFullName: "",
    dateOfBirth: "",
    isOver18: false,
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    name_visibility: "public",
    profileImage: null,
    bio: "",
    femaleBodyType: "",
    bustSize: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      let updatedValue = type === "checkbox" ? checked : value;
      let newFormData = { ...formData, [name]: updatedValue };

      if (name === "dateOfBirth") {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        newFormData.age = isNaN(age) ? "" : age;
      }

      setFormData(newFormData);
    }
  };

  const nextStep = () => {
    // For user role, we use a special flow
    if (formData.role === "user" && currentStep === 1) {
      setCurrentStep(100); // Use 100 as the special step for user registration details
    } else if (formData.role === "user" && currentStep === 100) {
      setCurrentStep(2); // Continue to step 2 after user details
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    // For user role, handle going back from the special user step
    if (formData.role === "user" && currentStep === 100) {
      setCurrentStep(1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

 const genderBasedOptions = {
 Male: {
  height: [
    "<4'", "4'", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"",
    "4'9\"", "4'10\"", "4'11\"", "5'", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"",
    "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'", "6'1\"", "6'2\"", "6'3\"", "6'4\"",
    "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"", "7'", ">7'"
  ],
  weight: [
    "<100", "100", "101", "102", "103", "104", "105", "106", "107", "108",
    "109", "110", "111", "112", "113", "114", "115", "116", "117", "118",
    "119", "120", "121", "122", "123", "124", "125", "126", "127", "128",
    "129", "130", "131", "132", "133", "134", "135", "136", "137", "138",
    "139", "140", "141", "142", "143", "144", "145", "146", "147", "148",
    "149", "150", "151", "152", "153", "154", "155", "156", "157", "158",
    "159", "160", "161", "162", "163", "164", "165", "166", "167", "168",
    "169", "170", "171", "172", "173", "174", "175", "176", "177", "178",
    "179", "180", "181", "182", "183", "184", "185", "186", "187", "188",
    "189", "190", "191", "192", "193", "194", "195", "196", "197", "198",
    "199", "200", "201", "202", "203", "204", "205", "206", "207", "208",
    "209", "210", "211", "212", "213", "214", "215", "216", "217", "218",
    "219", "220", "221", "222", "223", "224", "225", "226", "227", "228",
    "229", "230", "231", "232", "233", "234", "235", "236", "237", "238",
    "239", "240", "241", "242", "243", "244", "245", "246", "247", "248",
    "249", "250", "251", "252", "253", "254", "255", "256", "257", "258",
    "259", "260", "261", "262", "263", "264", "265", "266", "267", "268",
    "269", "270", "271", "272", "273", "274", "275", "276", "277", "278",
    "279", "280", "281", "282", "283", "284", "285", "286", "287", "288",
    "289", "290", "291", "292", "293", "294", "295", "296", "297", "298",
    "299", "300", ">300"
  ],
  shoe_size: [
    "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5",
    "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10",
    "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15",
    "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "19.5", "20",
    ">20"
  ]
},
  Female: {
  height: [
    "<4'", "4'", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"",
    "4'9\"", "4'10\"", "4'11\"", "5'", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"",
    "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'", "6'1\"", "6'2\"", "6'3\"", "6'4\"",
    "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"", "7'", ">7'"
  ],
  weight: [
    "<100", "100", "101", "102", "103", "104", "105", "106", "107", "108",
    "109", "110", "111", "112", "113", "114", "115", "116", "117", "118",
    "119", "120", "121", "122", "123", "124", "125", "126", "127", "128",
    "129", "130", "131", "132", "133", "134", "135", "136", "137", "138",
    "139", "140", "141", "142", "143", "144", "145", "146", "147", "148",
    "149", "150", "151", "152", "153", "154", "155", "156", "157", "158",
    "159", "160", "161", "162", "163", "164", "165", "166", "167", "168",
    "169", "170", "171", "172", "173", "174", "175", "176", "177", "178",
    "179", "180", "181", "182", "183", "184", "185", "186", "187", "188",
    "189", "190", "191", "192", "193", "194", "195", "196", "197", "198",
    "199", "200", "201", "202", "203", "204", "205", "206", "207", "208",
    "209", "210", "211", "212", "213", "214", "215", "216", "217", "218",
    "219", "220", "221", "222", "223", "224", "225", "226", "227", "228",
    "229", "230", "231", "232", "233", "234", "235", "236", "237", "238",
    "239", "240", "241", "242", "243", "244", "245", "246", "247", "248",
    "249", "250", "251", "252", "253", "254", "255", "256", "257", "258",
    "259", "260", "261", "262", "263", "264", "265", "266", "267", "268",
    "269", "270", "271", "272", "273", "274", "275", "276", "277", "278",
    "279", "280", "281", "282", "283", "284", "285", "286", "287", "288",
    "289", "290", "291", "292", "293", "294", "295", "296", "297", "298",
    "299", "300", ">300"
  ],
  shoe_size: [
    "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5",
    "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10",
    "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15",
    "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "19.5", "20",
    ">20"
  ]
},
  Other: {
    height: [],
    weight: [],
    shoe_size: []
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  // From Step 2 → route to gender-specific screen (or skip to upload if Other/blank)
  if (currentStep === 2) {
    if (formData.gender === "Male") { setCurrentStep(3); return; }
    if (formData.gender === "Female") { setCurrentStep(4); return; }
    setCurrentStep(5); // Other/undefined → straight to upload/verification
    return;
  }

  // Step 3 (Male details) → go to upload step
  if (currentStep === 3 && formData.gender === "Male") {
    setCurrentStep(5);
    return;
  }

  // Step 4 (Female details) → go to upload step
  if (currentStep === 4 && formData.gender === "Female") {
    setCurrentStep(5);
    return;
  }

  // Step 100: User role → Add Funds popup
  if (currentStep === 100) {
    setShowFundsPopup(true);
    return;
  }

  // Step 1: Contributor role → show pathway popup
  if (currentStep === 1 && formData.role === "contributor") {
    setShowCreatorPathwayPopup(true);
    return;
  }

  // Step 1: User role → go to user registration details
  if (currentStep === 1 && formData.role === "user") {
    setCurrentStep(100);
    return;
  }

  // Step 5 (Upload/verification) → go to 2FA (your 2FA is case 7)
  if (currentStep === 5) {
    setCurrentStep(7);
    return;
  }

  // Default: advance
  nextStep();
};


  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  const handleAddPhoto = () => {
    const newPhotoId = `additionalPhoto-${Date.now()}`;
    setAdditionalPhotos([...additionalPhotos, { id: newPhotoId, file: null }]);
  };

  const handleAdditionalPhotoChange = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const updatedPhotos = additionalPhotos.map((photo) =>
        photo.id === id ? { ...photo, file: e.target.files[0] } : photo
      );
      setAdditionalPhotos(updatedPhotos);
    }
  };

  const handleRemovePhoto = (id) => {
    setAdditionalPhotos(additionalPhotos.filter((photo) => photo.id !== id));
  };

  const handleFundsSubmit = async (e) => {
    e.preventDefault();
    try {
      const isContributor = formData.role === "contributor"; // ✅ role check
  
      if (isContributor) {
        const payload = {
          email: formData.email,
          password: formData.password,
          screenName: formData.screenName || "",
          legalFullName: formData.legalFullName || "",
          creatorPathway: formData.creatorPathway || "",
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          phoneNumber: formData.phoneNumber || "",
          address: formData.address || "",
          city: formData.city || "",
          state: formData.state || "",
          zipCode: formData.zipCode || "",
          country: formData.country || "",
          nameVisibility: formData.name_visibility || "public",
          isOver18: !!formData.isOver18,
          bio: formData.bio || "",
          dateOfBirth: formData.dateOfBirth || null,
          age: formData.age || null,
          gender: formData.gender || "",
          height: formData.height || "",
          weight: formData.weight || "",
          shoeSize: formData.shoe_size || "",
          skinTone: formData.skin_tone || "",
          hairColor: formData.hair_color || "",
          countryResidence: formData.country_residence || "",
          nationality: formData.nationality || "",
          occupation: formData.occupation || "",
          bodyType: formData.body_type || "",
          penisLength: formData.penis_length || "",
          femaleBodyType: formData.femaleBodyType || "",
          bustSize: formData.bustSize || "",
          milf: formData.milf || "",
          idDocument: formData.idDocument || null,
        };
  
        // ✅ Only one FormData object
        const uploadData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (payload[key] !== null && payload[key] !== undefined) {
            uploadData.append(key, payload[key]);
          }
        });
  
        const response = await fetch(`${BASE_URL}accounts/register/contributor/`, {
          method: "POST",
          body: uploadData,
        });
  
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Signup failed:", errData);
          alert("Signup failed. Please complete all required fields.");
          return;
        }
  
        const { access, profile } = await response.json();
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", access);
        localStorage.setItem("username", profile.email);
        localStorage.setItem("role", profile.role);
        setShowFundsPopup(false);
        navigate("/creator-dashboard");
      } else {
        // First register the user
        const registerRes = await fetch(`${BASE_URL}accounts/register/user/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            screenName: formData.screenName || "",
          }),
        });
  
        if (!registerRes.ok) {
          const errData = await registerRes.json().catch(() => ({}));
          console.error("User registration failed:", errData);
          alert("User registration failed. Please check your inputs.");
          return;
        }
  
        const { access, profile } = await registerRes.json();
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", access);
        localStorage.setItem("username", profile.email);
        localStorage.setItem("role", profile.role);
  
        // Then add funds
        const fundsRes = await fetch(`${BASE_URL}accounts/add-funds/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`,
          },
          body: JSON.stringify({
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            securityCode: formData.securityCode,
          }),
        });
  
        if (!fundsRes.ok) {
          const errData = await fundsRes.json().catch(() => ({}));
          console.error("Add funds failed:", errData);
  
          let errorMessage = "Add funds failed. Please check your payment information.";
          if (errData.cardNumber) {
            errorMessage = `Card Number: ${errData.cardNumber[0]}`;
          } else if (errData.expiryDate) {
            errorMessage = `Expiry Date: ${errData.expiryDate[0]}`;
          } else if (errData.securityCode) {
            errorMessage = `Security Code: ${errData.securityCode[0]}`;
          } else if (errData.detail) {
            errorMessage = errData.detail;
          }
  
          alert(errorMessage);
          return;
        }
  
        const fundsData = await fundsRes.json();
        console.log("Funds added successfully:", fundsData);
  
        setShowFundsPopup(false);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Please check required fields.");
    }
  };
  

  const handleCreatorPathwaySelect = (pathway) => {
    setFormData({
      ...formData,
      creatorPathway: pathway,
    });
    setShowCreatorPathwayPopup(false);
    nextStep(); // Continue to next step after pathway selected
  };

  const scrollbarStyle = {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
  };

  // Render different form based on current step

  // 2FA code state for the 2FA step
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const handleTwoFactorVerify = (e) => {
    e.preventDefault();
    if (twoFactorCode && twoFactorCode.length === 6) {
      // Simulate verification, then complete registration
      navigate("/dashboard");
    }
  };

  // Render Two Factor Auth step (no hooks inside)
  const renderTwoFactorStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold text-[#ceb46a] text-center mb-8">Two-Factor Authentication</h1>
      <form onSubmit={handleTwoFactorVerify} className="space-y-6 w-full max-w-xs">
        <div>
          <label htmlFor="code" className="block text-white mb-2 text-lg">Enter 2FA Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={twoFactorCode}
            onChange={e => setTwoFactorCode(e.target.value)}
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
  );

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 100:
        return renderUserDetails();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 7:
        return renderTwoFactorStep();
      default:
        return renderStep1();
    }
  };

  // Step 1: Account details (email, password, role)
  const renderStep1 = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-white mb-1">
            Email<span className="text-white">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-white mb-1">
            Confirm Password<span className="text-white">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-white mb-1">
            Register as<span className="text-white">*</span>
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white appearance-none"
              required
            >
              <option value="">Select Role</option>
              <option value="contributor">Content Contributor</option>
              <option value="user">User</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-start mt-6">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 accent-[#ceb46a]"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-300">
              By creating an account you're agreeing to our{" "}
              <Link to="/terms" className="text-[#ceb46a] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#ceb46a] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    );
  };

  // Special step for User role - User Registration Details
  const renderUserDetails = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-semibold text-[#CEB46A] mb-5 text-center">
          User Registration Details
        </h3>

        <div>
          <label htmlFor="screenName" className="block text-white mb-3">
            Screen Name
          </label>
          <input
            type="text"
            id="screenName"
            name="screenName"
            value={formData.screenName}
            onChange={handleChange}
            placeholder="Enter screen name"
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          />
        </div>

        <div className="flex items-start mt-6">
          <div className="flex items-center h-5">
            <input
              id="isOver18"
              name="isOver18"
              type="checkbox"
              checked={formData.isOver18}
              onChange={handleChange}
              className="w-4 h-4 accent-[#ceb46a]"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="isOver18" className="text-gray-300">
              I confirm that I am 18 years of age or older.
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
          >
            Add Funds
          </button>
        </div>
      </form>
    );
  };

  // Add Funds popup
  const renderFundsPopup = () => {
    if (!showFundsPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#1c1c1e] rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#CEB46A]">Add Funds</h3>
            <button
              onClick={() => setShowFundsPopup(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFundsSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-white mb-2">
                Card Number<span className="text-white">*</span>
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-white mb-2">
                Expiry Date<span className="text-white">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YYYY"
                  className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white pr-10"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="securityCode" className="block text-white mb-2">
                Security Code
              </label>
              <input
                type="text"
                id="securityCode"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                placeholder="Enter 4 digit security code"
                className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
                required
              />
            </div>

           <div className="pt-4 flex space-x-3">
  <button
    type="submit"
    className="w-1/2 py-3 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
  >
    Submit
  </button>
  <button
    type="button"
    onClick={() => {
      setShowFundsPopup(false);
      navigate("/dashboard");
    }}
    className="w-1/2 py-3 border border-[#ceb46a] text-[#ceb46a] font-medium rounded hover:bg-[#2c2c2e] transition duration-300 focus:outline-none"
  >
    Complete Later
  </button>
          </div>

          </form>
        </div>
      </div>
    );
  };

  // Creator Pathway Selection popup
  const renderCreatorPathwayPopup = () => {
    if (!showCreatorPathwayPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto">
        <div className="bg-[#1C1C1E] rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4">
          <h2 className="text-base font-bold text-center mb-6 text-white">
            Select Your Contributor Pathway
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
  {
    title: "Crowd Cash",
    description: `With Crowd Cash you can name your crowdfund price for each body part you're comfortable showing. Crowdfunding begins immediately and payout is issued once target is met. Set your price and retire early!`,
    steps: [
      "We will NEVER sell your personal information. All information gathered is for legal purposes or site functionality.",
      "Registration process takes 10-15 minutes.",
      "To complete registration you must verify your age & identity using our 3rd party partner. Be prepared to capture a selfie photo and share photos of identification documents.",
    ],
    benefits: [
      'Eligible for "Teaser Photo" Hot Body Contests',
      "Eligible to receive Tips (coming soon)",
    ],
    pathway: "crowdCash",
  },
  {
    title: "Contests",
    description: `Ready to make money immediately, but want to remain anonymous? With this pathway you can win Contests and sell content without revealing your identity.`,
    steps: [
      "We will NEVER sell your personal information. All information gathered is for legal purposes or site functionality.",
      "Registration process takes 10-15 minutes.",
      "To complete registration you must verify your age & identity using our 3rd party partner. Be prepared to capture a selfie photo and share photos of identification documents.",
    ],
    benefits: [
      "Remain anonymous",
      "Eligible for ALL Hot Body Contests",
      "Eligible for Crowd Cash (face reveal)",
      "Eligible to sell Photo Galleries (coming soon)",
      "Eligible to receive Tips (coming soon)",
    ],
    pathway: "contests",
  },
  {
    title: "Creator",
    description: `Ready to use your greatest assets to get discovered, engage with fans, sell content, and win Contests? Upload your content and start collecting!`,
    steps: [
      "We will NEVER sell your personal information. All information gathered is for legal purposes or site functionality.",
      "Registration process takes 10-15 minutes.",
      "To complete registration you must verify your age & identity using our 3rd party partner. Be prepared to capture a selfie photo and share photos of identification documents.",
    ],
    benefits: [
      "Use face and name to promote content",
      "Eligible for ALL Hot Body Contests",
      "Eligible to sell Photo Galleries (coming soon)",
      "Eligible to receive Tips (coming soon)",
      "Eligible for Direct Messaging (coming soon)",
      "Eligible for monthly Subscription option (coming soon)",
      "Eligible to upload photos from external sources to the Subscription Photo Gallery (coming soon)",
    ],
    pathway: "creator",
  },
].map((option) => (
              <div
                key={option.pathway}
                className="bg-black rounded-lg shadow-lg p-4 flex flex-col"
              >
                <h2 className="text-base font-bold text-center mb-2 text-[#ceb46a]">
                  {option.title}
                </h2>

                <div className="mb-2">
                  <h3 className="font-semibold text-sm mb-1">Ideal Creator:</h3>
                  <p className="text-white text-xs">{option.description}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-semibold text-sm mb-1">Next Steps:</h3>
                  <ul className="list-disc pl-4 text-white text-xs">
                    {option.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-2">
                  <h3 className="font-semibold text-sm mb-1">
                    Additional Benefits:
                  </h3>
                  <ul className="list-disc pl-4 text-white text-xs">
                    {option.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => handleCreatorPathwaySelect(option.pathway)}
                    className="w-full py-2 bg-[#ceb46a] text-black font-medium rounded transition duration-300 focus:outline-none text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Personal Information
  const renderStep2 = () => {
  console.log("Current gender value:", formData.gender); 
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#CEB46A] mb-5 text-center">
          Creator Registration Details
        </h3>

        {/* Legal Full Name */}
        <div>
          <label htmlFor="legalFullName" className="block text-white mb-1">
            Legal Full Name<span className="text-white">*</span>
          </label>
          <input
            type="text"
            id="legalFullName"
            name="legalFullName"
            value={formData.legalFullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          />
        </div>

        {/* Publish Option */}
        {/* Name Visibility Option */}
<div>
  <label htmlFor="name_visibility" className="block text-white mb-1">
    Allow Name in Search<span className="text-white">*</span>
  </label>
  <select
    id="name_visibility"
    name="name_visibility"
    value={formData.name_visibility}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="public">Allow Name in Search</option>
    <option value="private">Keep Name Private</option>
  </select>
</div>


        {/* Screen Name */}
        <div>
          <label htmlFor="screenName" className="block text-white mb-1">
            Screen Name
          </label>
          <input
            type="text"
            id="screenName"
            name="screenName"
            value={formData.screenName}
            onChange={handleChange}
            placeholder="Enter Screen Name"
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-white mb-1">
            Date of Birth*
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white dark:[color-scheme:dark]"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-white mb-1">
            Age
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            placeholder="Age will be calculated"
            readOnly
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded text-white"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-white mb-1">
            Phone Number<span className="text-white">*</span>
          </label>
          <div className="flex">
            <select
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className="bg-[#1c1c1e] border border-gray-600 text-white px-2 rounded-l focus:outline-none"
            >
              <option value="+1">🇺🇸 +1</option>
              {/* Add more as needed */}
            </select>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full py-2 px-4 bg-[#1c1c1e] border-t border-b border-r border-gray-600 rounded-r focus:outline-none focus:border-[#ceb46a] text-white"
              required
            />
          </div>
        </div>

        {/* Country of Legal Residence */}
<div>
  <label htmlFor="country_residence" className="block text-white mb-1">
    Country of Legal Residence<span className="text-white">*</span>
  </label>
  <select
    id="country_residence"
    name="country_residence"
    value={formData.country_residence}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="">Select Country</option>
    <option value="US">United States</option>
  </select>
</div>

       {/* Gender */}
<div>
  <label htmlFor="gender" className="block text-white mb-1">
    Gender<span className="text-white">*</span>
  </label>
  <select
    id="gender"
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

{/* Height */}
{formData.gender && (
  <div>
    <label htmlFor="height" className="block text-white mb-1">
      Height<span className="text-white">*</span>
    </label>
    <select
      id="height"
      name="height"
      value={formData.height}
      onChange={handleChange}
      className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
      required
    >
      <option value="">Select Height</option>
      {genderBasedOptions[formData.gender]?.height.map((h, idx) => (
        <option key={idx} value={h}>{h}</option>
      ))}
    </select>
  </div>
)}

{/* Weight */}
{formData.gender && (
  <div>
    <label htmlFor="weight" className="block text-white mb-1">
      Weight (lbs)<span className="text-white">*</span>
    </label>
    <select
      id="weight"
      name="weight"
      value={formData.weight}
      onChange={handleChange}
      className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
      required
    >
      <option value="">Select Weight</option>
      {genderBasedOptions[formData.gender]?.weight.map((w, idx) => (
        <option key={idx} value={w}>{w}</option>
      ))}
    </select>
  </div>
)}

{/* Shoe Size */}
{formData.gender && (
  <div>
    <label htmlFor="shoe_size" className="block text-white mb-1">
      Shoe Size<span className="text-white">*</span>
    </label>
    <select
      id="shoe_size"
      name="shoe_size"
      value={formData.shoe_size}
      onChange={handleChange}
      className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
      required
    >
      <option value="">Select Shoe Size</option>
      {genderBasedOptions[formData.gender]?.shoe_size.map((s, idx) => (
        <option key={idx} value={s}>{s}</option>
      ))}
    </select>
  </div>
)}


        {/* Skin Tone */}
        <div>
          <label htmlFor="skin_tone" className="block text-white mb-1">
            Skin Tone<span className="text-white">*</span>
          </label>
          <select
            id="skin_tone"
            name="skin_tone"
            value={formData.skin_tone}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          >
            <option value="">Select Skin Tone</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        {/* Hair Color */}
        <div>
          <label htmlFor="hair_color" className="block text-white mb-1">
            Hair Color<span className="text-white">*</span>
          </label>
          <select
            id="hair_color"
            name="hair_color"
            value={formData.hair_color}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          >
            <option value="">Select Hair Color</option>
            <option value="Blonde">Blonde</option>
            <option value="Brown">Brown</option>
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="Auburn">Auburn</option>
            <option value="Dirty Blonde">Dirty Blonde</option>
            <option value="Strawberry Blonde">Strawberry Blonde</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* State */}
      <div>
  <label htmlFor="state" className="block text-white mb-1">
    State (optional)
  </label>
  <select
    id="state"
    name="state"
    value={formData.state}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 text-white rounded focus:outline-none focus:border-[#ceb46a]"
  >
    <option value="">Select your State</option>
    <option value="Alabama">Alabama</option>
    <option value="Alaska">Alaska</option>
    <option value="Arizona">Arizona</option>
    <option value="Arkansas">Arkansas</option>
    <option value="California">California</option>
    <option value="Colorado">Colorado</option>
    <option value="Connecticut">Connecticut</option>
    <option value="Delaware">Delaware</option>
    <option value="District of Columbia">District of Columbia</option>
    <option value="Florida">Florida</option>
    <option value="Georgia">Georgia</option>
    <option value="Hawaii">Hawaii</option>
    <option value="Idaho">Idaho</option>
    <option value="Illinois">Illinois</option>
    <option value="Indiana">Indiana</option>
    <option value="Iowa">Iowa</option>
    <option value="Kansas">Kansas</option>
    <option value="Kentucky">Kentucky</option>
    <option value="Louisiana">Louisiana</option>
    <option value="Maine">Maine</option>
    <option value="Maryland">Maryland</option>
    <option value="Massachusetts">Massachusetts</option>
    <option value="Michigan">Michigan</option>
    <option value="Minnesota">Minnesota</option>
    <option value="Mississippi">Mississippi</option>
    <option value="Missouri">Missouri</option>
    <option value="Montana">Montana</option>
    <option value="Nebraska">Nebraska</option>
    <option value="Nevada">Nevada</option>
    <option value="New Hampshire">New Hampshire</option>
    <option value="New Jersey">New Jersey</option>
    <option value="New Mexico">New Mexico</option>
    <option value="New York">New York</option>
    <option value="North Carolina">North Carolina</option>
    <option value="North Dakota">North Dakota</option>
    <option value="Ohio">Ohio</option>
    <option value="Oklahoma">Oklahoma</option>
    <option value="Oregon">Oregon</option>
    <option value="Pennsylvania">Pennsylvania</option>
    <option value="Rhode Island">Rhode Island</option>
    <option value="South Carolina">South Carolina</option>
    <option value="South Dakota">South Dakota</option>
    <option value="Tennessee">Tennessee</option>
    <option value="Texas">Texas</option>
    <option value="Utah">Utah</option>
    <option value="Vermont">Vermont</option>
    <option value="Virginia">Virginia</option>
    <option value="Washington">Washington</option>
    <option value="West Virginia">West Virginia</option>
    <option value="Wisconsin">Wisconsin</option>
    <option value="Wyoming">Wyoming</option>
  </select>
</div>


        {/* Nationality */}
       <div>
  <label htmlFor="nationality" className="block text-white mb-1">
    Nationality (optional)
  </label>
  <select
    id="nationality"
    name="nationality"
    value={formData.nationality}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 text-white rounded focus:outline-none focus:border-[#ceb46a]"
  >
    <option value="">Select your nationality</option>
    <option value="Afghan">Afghan</option>
    <option value="Albanian">Albanian</option>
    <option value="Algerian">Algerian</option>
    <option value="American">American</option>
    <option value="Andorran">Andorran</option>
    <option value="Angolan">Angolan</option>
    <option value="Antiguans">Antiguans</option>
    <option value="Argentinean">Argentinean</option>
    <option value="Armenian">Armenian</option>
    <option value="Australian">Australian</option>
    <option value="Austrian">Austrian</option>
    <option value="Azerbaijani">Azerbaijani</option>
    <option value="Bahamian">Bahamian</option>
    <option value="Bahraini">Bahraini</option>
    <option value="Bangladeshi">Bangladeshi</option>
    <option value="Barbadian">Barbadian</option>
    <option value="Barbudans">Barbudans</option>
    <option value="Batswana">Batswana</option>
    <option value="Belarusian">Belarusian</option>
    <option value="Belgian">Belgian</option>
    <option value="Belizean">Belizean</option>
    <option value="Beninese">Beninese</option>
    <option value="Bhutanese">Bhutanese</option>
    <option value="Bolivian">Bolivian</option>
    <option value="Bosnian">Bosnian</option>
    <option value="Brazilian">Brazilian</option>
    <option value="British">British</option>
    <option value="Bruneian">Bruneian</option>
    <option value="Bulgarian">Bulgarian</option>
    <option value="Burkinabe">Burkinabe</option>
    <option value="Burmese">Burmese</option>
    <option value="Burundian">Burundian</option>
    <option value="Cambodian">Cambodian</option>
    <option value="Cameroonian">Cameroonian</option>
    <option value="Canadian">Canadian</option>
    <option value="Cape Verdean">Cape Verdean</option>
    <option value="Central African">Central African</option>
    <option value="Chadian">Chadian</option>
    <option value="Chilean">Chilean</option>
    <option value="Chinese">Chinese</option>
    <option value="Colombian">Colombian</option>
    <option value="Comoran">Comoran</option>
    <option value="Congolese">Congolese</option>
    <option value="Costa Rican">Costa Rican</option>
    <option value="Croatian">Croatian</option>
    <option value="Cuban">Cuban</option>
    <option value="Cypriot">Cypriot</option>
    <option value="Czech">Czech</option>
    <option value="Danish">Danish</option>
    <option value="Djibouti">Djibouti</option>
    <option value="Dominican">Dominican</option>
    <option value="Dutch">Dutch</option>
    <option value="East Timorese">East Timorese</option>
    <option value="Ecuadorean">Ecuadorean</option>
    <option value="Egyptian">Egyptian</option>
    <option value="Emirian">Emirian</option>
    <option value="Equatorial Guinean">Equatorial Guinean</option>
    <option value="Eritrean">Eritrean</option>
    <option value="Estonian">Estonian</option>
    <option value="Ethiopian">Ethiopian</option>
    <option value="Fijian">Fijian</option>
    <option value="Filipino">Filipino</option>
    <option value="Finnish">Finnish</option>
    <option value="French">French</option>
    <option value="Gabonese">Gabonese</option>
    <option value="Gambian">Gambian</option>
    <option value="Georgian">Georgian</option>
    <option value="German">German</option>
    <option value="Ghanaian">Ghanaian</option>
    <option value="Greek">Greek</option>
    <option value="Grenadian">Grenadian</option>
    <option value="Guatemalan">Guatemalan</option>
    <option value="Guinea-Bissauan">Guinea-Bissauan</option>
    <option value="Guinean">Guinean</option>
    <option value="Guyanese">Guyanese</option>
    <option value="Haitian">Haitian</option>
    <option value="Herzegovinian">Herzegovinian</option>
    <option value="Honduran">Honduran</option>
    <option value="Hungarian">Hungarian</option>
    <option value="I-Kiribati">I-Kiribati</option>
    <option value="Icelander">Icelander</option>
    <option value="Indian">Indian</option>
    <option value="Indonesian">Indonesian</option>
    <option value="Iranian">Iranian</option>
    <option value="Iraqi">Iraqi</option>
    <option value="Irish">Irish</option>
    <option value="Israeli">Israeli</option>
    <option value="Italian">Italian</option>
    <option value="Ivorian">Ivorian</option>
    <option value="Jamaican">Jamaican</option>
    <option value="Japanese">Japanese</option>
    <option value="Jordanian">Jordanian</option>
    <option value="Kazakhstani">Kazakhstani</option>
    <option value="Kenyan">Kenyan</option>
    <option value="Kittian and Nevisian">Kittian and Nevisian</option>
    <option value="Kuwaiti">Kuwaiti</option>
    <option value="Kyrgyz">Kyrgyz</option>
    <option value="Laotian">Laotian</option>
    <option value="Latvian">Latvian</option>
    <option value="Lebanese">Lebanese</option>
    <option value="Liberian">Liberian</option>
    <option value="Libyan">Libyan</option>
    <option value="Liechtensteiner">Liechtensteiner</option>
    <option value="Lithuanian">Lithuanian</option>
    <option value="Luxembourger">Luxembourger</option>
    <option value="Macedonian">Macedonian</option>
    <option value="Malagasy">Malagasy</option>
    <option value="Malawian">Malawian</option>
    <option value="Malaysian">Malaysian</option>
    <option value="Maldivian">Maldivian</option>
    <option value="Malian">Malian</option>
    <option value="Maltese">Maltese</option>
    <option value="Marshallese">Marshallese</option>
    <option value="Mauritanian">Mauritanian</option>
    <option value="Mauritian">Mauritian</option>
    <option value="Mexican">Mexican</option>
    <option value="Micronesian">Micronesian</option>
    <option value="Moldovan">Moldovan</option>
    <option value="Monacan">Monacan</option>
    <option value="Mongolian">Mongolian</option>
    <option value="Moroccan">Moroccan</option>
    <option value="Mosotho">Mosotho</option>
    <option value="Motswana">Motswana</option>
    <option value="Mozambican">Mozambican</option>
    <option value="Namibian">Namibian</option>
    <option value="Nauruan">Nauruan</option>
    <option value="Nepalese">Nepalese</option>
    <option value="New Zealander">New Zealander</option>
    <option value="Ni-Vanuatu">Ni-Vanuatu</option>
    <option value="Nicaraguan">Nicaraguan</option>
    <option value="Nigerian">Nigerian</option>
    <option value="Nigerien">Nigerien</option>
    <option value="North Korean">North Korean</option>
    <option value="Northern Irish">Northern Irish</option>
    <option value="Norwegian">Norwegian</option>
    <option value="Omani">Omani</option>
    <option value="Pakistani">Pakistani</option>
    <option value="Palauan">Palauan</option>
    <option value="Panamanian">Panamanian</option>
    <option value="Papua New Guinean">Papua New Guinean</option>
    <option value="Paraguayan">Paraguayan</option>
    <option value="Peruvian">Peruvian</option>
    <option value="Polish">Polish</option>
    <option value="Portuguese">Portuguese</option>
    <option value="Qatari">Qatari</option>
    <option value="Romanian">Romanian</option>
    <option value="Russian">Russian</option>
    <option value="Rwandan">Rwandan</option>
    <option value="Saint Lucian">Saint Lucian</option>
    <option value="Salvadoran">Salvadoran</option>
    <option value="Samoan">Samoan</option>
    <option value="San Marinese">San Marinese</option>
    <option value="Sao Tomean">Sao Tomean</option>
    <option value="Saudi">Saudi</option>
    <option value="Scottish">Scottish</option>
    <option value="Senegalese">Senegalese</option>
    <option value="Serbian">Serbian</option>
    <option value="Seychellois">Seychellois</option>
    <option value="Sierra Leonean">Sierra Leonean</option>
    <option value="Singaporean">Singaporean</option>
    <option value="Slovakian">Slovakian</option>
    <option value="Slovenian">Slovenian</option>
    <option value="Solomon Islander">Solomon Islander</option>
    <option value="Somali">Somali</option>
    <option value="South African">South African</option>
    <option value="South Korean">South Korean</option>
    <option value="Spanish">Spanish</option>
    <option value="Sri Lankan">Sri Lankan</option>
    <option value="Sudanese">Sudanese</option>
    <option value="Surinamer">Surinamer</option>
    <option value="Swazi">Swazi</option>
    <option value="Swedish">Swedish</option>
    <option value="Swiss">Swiss</option>
    <option value="Syrian">Syrian</option>
    <option value="Taiwanese">Taiwanese</option>
    <option value="Tajik">Tajik</option>
    <option value="Tanzanian">Tanzanian</option>
    <option value="Thai">Thai</option>
    <option value="Togolese">Togolese</option>
    <option value="Tongan">Tongan</option>
    <option value="Trinidadian/Tobagonian">Trinidadian/Tobagonian</option>
    <option value="Tunisian">Tunisian</option>
    <option value="Turkish">Turkish</option>
    <option value="Tuvaluan">Tuvaluan</option>
    <option value="Ugandan">Ugandan</option>
    <option value="Ukrainian">Ukrainian</option>
    <option value="Uruguayan">Uruguayan</option>
    <option value="Uzbekistani">Uzbekistani</option>
    <option value="Venezuelan">Venezuelan</option>
    <option value="Vietnamese">Vietnamese</option>
    <option value="Welsh">Welsh</option>
    <option value="Yemenite">Yemenite</option>
    <option value="Zambian">Zambian</option>
    <option value="Zimbabwean">Zimbabwean</option>
  </select>
</div>


        {/* Occupation */}
        <div>
          <label htmlFor="occupation" className="block text-white mb-1">
            Occupation (optional)
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Enter your occupation"
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4 space-x-2">
          <button
            type="button"
            onClick={prevStep}
            className="py-3 px-6 w-1/2 border border-[#ceb46a] text-[#ceb46a] font-medium rounded hover:bg-[#1c1c1e] transition duration-300 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-3 px-6 w-1/2 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    );
  };
  // Step 4: Profile Setup
  const renderStep3 = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#CEB46A] mb-5 text-center">
          Registration Detail (Males)
        </h3>

        {/* Body Type */}
       <div className="relative">
  <label htmlFor="body_type" className="block text-white mb-1 flex items-center gap-1">
    Body Type<span className="text-white">*</span>
    <div className="group relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-[#CEB46A] cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
      <div className="absolute z-10 hidden group-hover:block w-72 p-3 bg-[#1c1c1e] border border-gray-600 rounded text-xs text-white top-6 left-0">
        <p className="font-semibold mb-1">Recommended Body Type for Height & Weight</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-500 pb-1">Type</th>
              <th className="border-b border-gray-500 pb-1">Height</th>
              <th className="border-b border-gray-500 pb-1">Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Short & Fit</td><td>&lt;5'9"</td><td>&lt;150</td></tr>
            <tr><td>Short & Broad</td><td>&lt;5'9"</td><td>&gt;150</td></tr>
            <tr><td>Athletic/Avg</td><td>5'9"-6'2"</td><td>&lt;249</td></tr>
            <tr><td>Tall & Fit</td><td>&gt;6'2"</td><td>&lt;249</td></tr>
            <tr><td>Big & Tall</td><td>&gt;5'9"</td><td>&gt;249</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </label>

  <select
    id="body_type"
    name="body_type"
    value={formData.body_type}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="">Select Body Type</option>
    <option value="Short & Thin">Short & Fit</option>
    <option value="Short & Broad">Short & Broad</option>
    <option value="Athletic/Average">Athletic/Avg</option>
    <option value="Tall & Slim">Tall & Fit</option>
    <option value="Big & Tall">Big & Tall</option>
  </select>
</div>


        {/* Penis Length */}
        <div>
  <label htmlFor="penis_length" className="block text-white mb-1">
    Penis Length (Inches)<span className="text-white">*</span>
  </label>
  <select
    id="penis_length"
    name="penis_length"
    value={formData.penis_length}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="">Select Penis Length</option>
    <option value="<4">&lt;4"</option>
    <option value="4-5.5">4-5.5"</option>
    <option value="6-7.5">6-7.5"</option>
    <option value="8-9.5">8-9.5"</option>
    <option value="10+">10+"</option>
  </select>
</div>


        {/* Buttons */}
        <div className="flex justify-between pt-4 space-x-2">
          <button
            type="button"
            onClick={prevStep}
            className="py-3 px-6 w-1/2 border border-[#ceb46a] text-[#ceb46a] font-medium rounded hover:bg-[#1c1c1e] transition duration-300 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-3 px-6 w-1/2 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    );
  };

  // Step 5: Profile Setup
  const renderStep4 = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#CEB46A] mb-5 text-center">
          Registration Detail (Females)
        </h3>

        {/* Body Type */}
        <div className="relative">
  <label htmlFor="femaleBodyType" className="block text-white mb-1 flex items-center gap-1">
    Body Type<span className="text-white">*</span>
    <div className="group relative inline-block">
      <InformationCircleIcon className="w-5 h-5 text-[#CEB46A] cursor-pointer" />
      <div className="absolute z-10 hidden group-hover:block w-72 p-3 bg-[#1c1c1e] border border-gray-600 rounded text-xs text-white">
        <p className="font-semibold mb-1">Recommended Body Type for Height & Weight</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-500 pb-1">Type</th>
              <th className="border-b border-gray-500 pb-1">Height</th>
              <th className="border-b border-gray-500 pb-1">Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Petite</td><td>&lt;5'4"</td><td>&lt;129</td></tr>
            <tr><td>Short & Curvy</td><td>&lt;5'4"</td><td>&gt;129</td></tr>
            <tr><td>Avg/Athletic</td><td>5'4"-5'8"</td><td>&lt;149</td></tr>
            <tr><td>Tall & Slender</td><td>&gt;5'8"</td><td>&lt;149</td></tr>
            <tr><td>Plus Size</td><td>&gt;5'4"</td><td>&gt;149</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </label>
  <select
    id="femaleBodyType"
    name="femaleBodyType"
    value={formData.femaleBodyType}
    onChange={handleChange}
    className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
    required
  >
    <option value="">Select Body Type</option>
    <option value="Petite">Petite</option>
    <option value="Short & Curvy">Short & Curvy</option>
    <option value="Avg/Athletic">Avg/Athletic</option>
    <option value="Tall & Slender">Tall & Slender</option>
    <option value="Plus Size">Plus Size</option>
  </select>
</div>


        {/* Bust Size */}
        <div>
          <label htmlFor="bustSize" className="block text-white mb-1">
            Bust Size<span className="text-white">*</span>
          </label>
          <select
            id="bustSize"
            name="bustSize"
            value={formData.bustSize}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
            required
          >
            <option value="">Select Bust Size</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="DD/E">DD/E</option>
            <option value="DDD/F">DDD/F</option>
            <option value=">DDD">&gt;DDD</option>
          </select>
        </div>

        {/* MILF (optional) */}
        <div>
          <label htmlFor="milf" className="block text-white mb-1">
            MILF (optional)
          </label>
          <select
            id="milf"
            name="milf"
            value={formData.milf}
            onChange={handleChange}
            className="w-full py-2 px-4 bg-[#1c1c1e] border border-gray-600 rounded focus:outline-none focus:border-[#ceb46a] text-white"
          >
            <option value="">Select MILF</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4 space-x-2">
          <button
            type="button"
            onClick={prevStep}
            className="py-3 px-6 w-1/2 border border-[#ceb46a] text-[#ceb46a] font-medium rounded hover:bg-[#1c1c1e] transition duration-300 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            className="py-3 px-6 w-1/2 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    );
  };

  // Step 6: Profile Setup
  const renderStep5 = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#ceb46a] text-center">
          Age and Identity Verification
        </h1>

        <p className="text-white">
          Before you can proceed with image uploads, we need to verify your age
          and identity.
        </p>

        <div className="space-y-4">
          {/* Main ID document upload */}
          <div>
            <label htmlFor="idDocument" className="block text-white mb-1">
              Upload ID Document*
            </label>
            <div className="w-full border border-gray-600 rounded bg-[#1c1c1e] overflow-hidden">
              <div className="flex">
                <label
                  htmlFor="idDocument"
                  className="py-2 px-4 bg-[#1c1c1e] border-r border-gray-600 text-white cursor-pointer hover:bg-[#2c2c2e]"
                >
                  Choose file
                </label>
                <span className="py-2 px-4 text-gray-400">
                  {formData.idDocument
                    ? formData.idDocument.name
                    : "No file chosen"}
                </span>
              </div>
              <input
                type="file"
                id="idDocument"
                name="idDocument"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Additional photo uploads */}
          {additionalPhotos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={photo.id} className="block text-white mb-1">
                  Additional Photo
                </label>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="w-full border border-gray-600 rounded bg-[#1c1c1e] overflow-hidden">
                <div className="flex">
                  <label
                    htmlFor={photo.id}
                    className="py-2 px-4 bg-[#1c1c1e] border-r border-gray-600 text-white cursor-pointer hover:bg-[#2c2c2e]"
                  >
                    Choose file
                  </label>
                  <span className="py-2 px-4 text-gray-400">
                    {photo.file ? photo.file.name : "No file chosen"}
                  </span>
                </div>
                <input
                  type="file"
                  id={photo.id}
                  onChange={(e) => handleAdditionalPhotoChange(photo.id, e)}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          ))}

          {/* Add another photo button */}
          <div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="text-[#ceb46a] font-medium flex items-center"
            >
              <span className="mr-2">+</span> Add Another Photo
            </button>
          </div>

          {/* Age confirmation checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="ageConfirm"
              name="ageConfirm"
              checked={formData.ageConfirm || false}
              onChange={handleChange}
              className="mr-2 h-4 w-4 border border-gray-600 rounded bg-[#1c1c1e]"
            />
            <label htmlFor="ageConfirm" className="text-white">
              I confirm that I am 18 years or older*
            </label>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 space-x-2 *:w-2/4">
          <button
            type="button"
            onClick={prevStep}
            className="py-3 px-6 border border-[#ceb46a] text-[#ceb46a] font-medium rounded hover:bg-[#1c1c1e] transition duration-300 focus:outline-none"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleFundsSubmit}   // 🔥 now calls API
            className="py-3 px-6 bg-[#ceb46a] text-black font-medium rounded hover:bg-[#b9a05a] transition duration-300 focus:outline-none flex-grow"
          >
            Complete Signup
          </button>
        </div>
      </div>
    );
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
        <div
          className="w-full max-w-md bg-[#1c1c1e] p-6 sm:p-8 rounded-lg shadow-lg h-[86vh] overflow-y-auto"
          style={scrollbarStyle}
        >
          {currentStep === 1 && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <img src={Logo} alt="Logo" className="w-[300px]" />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <>
              <h3 className="text-2xl font-semibold text-[#CEB46A] mb-2 text-center">
                Registration
              </h3>
              <p className="text-gray-400 text-center mb-6">
                The Internet's First and Only <br />
                Destination for Interactive Hot Body Contests
              </p>
            </>
          )}

          {renderForm()}
          {renderFundsPopup()}
          {renderCreatorPathwayPopup()}

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-[#ceb46a]">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
