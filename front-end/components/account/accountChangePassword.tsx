import AccountService from "@/services/accountService";
import { useState } from "react";


interface AccountChangePasswordProps {
    onClose(): void;
}

const AccountChangePassword: React.FC<AccountChangePasswordProps> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [serverError, setServerError] = useState("");

    const validate = (): boolean => {
        setCurrentPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setServerError("");
        let ok = true;
        if (currentPassword.trim() === "") {
            setCurrentPasswordError("Current password is required");
            ok = false;
        }
        if (newPassword.trim() === "") {
            setNewPasswordError("New password is required");
            ok = false;
        }
        if (confirmPassword.trim() === "") {
            setConfirmPasswordError("Confirm password is required");
            ok = false;
        }
        if (confirmPassword.trim() !== "" && newPassword !== "" && newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            setNewPasswordError("Passwords do not match");

            ok = false;
        }
        return ok;
    }

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await AccountService.changePassword(currentPassword, newPassword);
            if (!response.ok) {
                const data = await response.json();
                setServerError(data.message);
                return;
            }
            onClose();
        }
        catch (error) {
            setServerError("Oops.. Somthing went wrong. \n Try again later.")
        }
    }

    return (
        <div className="bg-transparent p-4 flex flex-col w-full h-full gap-2">
            <div>
                <label htmlFor="currentpassword" className="text-base text-slate-600">Current Password</label>
                <input onChange={(e) => setCurrentPassword(e.target.value)} id="currentpassword" type="password" placeholder="Enter your current password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                <div className="text-red-500 text-sm">{currentPasswordError}</div>
            </div>
            <div>
                <label htmlFor="newpassword" className="text-base text-slate-600">New Password</label>
                <input onChange={(e) => setNewPassword(e.target.value)} id="newpassword" type="password" placeholder="Enter your new password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                <div className="text-red-500 text-sm">{newPasswordError}</div>
            </div>
            <div>
                <label htmlFor="confirmpassword" className="text-base text-slate-600">Confirm Password</label>
                <input onChange={(e) => setConfirmPassword(e.target.value)} id="confirmpassword" type="password" placeholder="Confirm your new password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                <div className="text-red-500 text-sm">{confirmPasswordError}</div>
            </div>
            {serverError && <div className="w-full bg-red-500 bg-opacity-10  border-red-500 border rounded-lg py-2 px-2 text-red-500 text-sm">{serverError}</div>}

            <div className="flex justify-end gap-4 mt-2">
                <button onClick={() => onClose()} className="border border-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                <button onClick={() => handleSubmit()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
        </div>
    );
};

export default AccountChangePassword;

