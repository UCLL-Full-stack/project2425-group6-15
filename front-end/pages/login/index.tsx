import UserLoginForm from "@/components/user/userLoginForm";
import LoginUsersTable from "@/components/login/loginUsersTable";
import Head from "next/head";
import Link from "next/link";

const Register: React.FC = () => {
  return (
    <>
      <Head>
        <title>Register - JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <div className="mb-8">
        </div>

        <h1 className="text-5xl font-bold text-gray-900">Inloggen</h1>

        <UserLoginForm />
        <LoginUsersTable />
        <div className="mt-4">
          <Link href="/register">
            <span className="text-blue-500 hover:underline cursor-pointer">
              Nog geen account? Maak hier een aan.
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
