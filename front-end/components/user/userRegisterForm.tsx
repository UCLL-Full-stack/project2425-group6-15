import userService from "@/services/userService";
import { Gender } from "@/types";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import authService from "@/services/authService";

const UserRegisterForm: React.FC = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [countryCode, setCountryCode] = useState("+32"); // Default country code
  const [gender, setGender] = useState<Gender | "">("");
  const [genderError, setGenderError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");


  const validate = (): boolean => {
    setEmailError("");
    setPhoneError("");
    setGenderError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (firstName.trim() === "") {
      setEmailError("First name is required.");
      return false;
    }
    if (lastName.trim() === "") {
      setEmailError("Last name is required.");
      return false;
    }
    if (email.trim() === "") {
      setEmailError("Email is required.");
      return false;
    }
    if (phone === null) {
      setPhoneError("Phone number is required.");
      return false;
    }
    if (gender === "") {
      setGenderError("Gender is required.");
      return false;
    }
    if (password === "") {
      setPasswordError("Password is required.");
      return false;
    }
    if (confirmPassword === "") {
      setConfirmPasswordError("Please confirm your password.");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setPasswordError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (gender !== "male" && gender !== "female") {
      setGenderError("Sex must be either male or female.");
      return;
    }

    const userLogin = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: {countryCode: countryCode, number: (phone ?? 0).toString()},
      gender: gender, 
      password: password,
    };

    const response = await authService.register(userLogin);
    const data = await response.json();
    if (response.status == 200) {
      sessionStorage.setItem("token", data.token)
      

      router.push('/register/interests');      
    }
    else {
      setServerError(data.message);
    }
    


    console.log({
      firstName,
      lastName,
      email,
      phone: `${countryCode}${phone ?? 0}`,
      gender,
      password,
    });

    // Reset fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone(null);
    setCountryCode("+32"); 
    setGender("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
            title="First Name"
          />
          {firstName.trim() === "" && (
            <p className="text-red-500 text-sm"></p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Last Name"
            placeholder="Enter your last name"
          />
          {lastName.trim() === "" && (
            <p className="text-red-500 text-sm">.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            title="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex">
            <select
              title="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="p-2 w-fit border border-gray-300 rounded-tl-lg rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="+32">+32 (BE)</option>
              <option value="+31">+31 (NL)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+1">+1 (USA)</option>
            </select>
            <input
              type="tel" 
              value={phone ?? ""}
              onChange={(e) => setPhone(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-tr-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sex</label>
            <select
            title="Sex"
            aria-label="Sex"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Password"
            placeholder="Enter your password"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Confirm Password"
            placeholder="Confirm your password"
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm">{confirmPasswordError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 mt-4"
        >
          Register
        </button>
        {serverError && (
            <p className="text-red-500 text-sm">{serverError}</p>
          )}
      </form>
    </>
  );
};

export default UserRegisterForm;
