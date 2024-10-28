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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="flex flex-row w-full h-full max-w-7xl p-4 space-x-4">
          <div className="w-3/4 bg-white shadow-lg rounded-lg p-6">
            {/* Kaart sectie */}
            <h2 className="text-2xl font-bold mb-4">Kaart</h2>
            <div className="w-full h-64 bg-blue-200 rounded-lg">Kaartinhoud</div>
          </div>
          <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
            {/* Sidebar sectie */}
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
      </div>
    </>
  );
};

export default Dashboard;
