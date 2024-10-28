import Header from "@/components/header";
import Head from "next/head";
import Link from "next/link";

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <div className="grid grid-cols-[1fr_max-content] min-h-screen min-w-full  text-gray-800">
        <div className="w-full h-64 bg-blue-200 rounded-lg">Kaartinhoud</div>
        <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/option1" className="text-blue-500 hover:underline">
                  Optie 1
                </Link>
              </li>
              <li>
                <Link href="/option2" className="text-blue-500 hover:underline">
                  Optie 2
                </Link>
              </li>
              <li>
                <Link href="/option3" className="text-blue-500 hover:underline">
                  Optie 3
                </Link>
              </li>
            </ul>
          </div>
        </div>
          
    </>
  );
};

export default Dashboard;
