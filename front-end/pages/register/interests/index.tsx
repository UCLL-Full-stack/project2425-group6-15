import ChangeInterests from "@/components/interest/changeInterests";
import UserRegisterForm from "@/components/user/userRegisterForm";
import Head from "next/head";
import Link from "next/link";

const AddFirstInterests: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-5xl font-bold text-gray-900">What are you interested in?</h1>
      <ChangeInterests />
      </div>
    </>
  );
};

export default AddFirstInterests;
