import Header from "@/components/header";
import Head from "next/head";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    });
  }, []);

  return (
    <>
      <Head>
        <title>JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <div className="container grid grid-cols-[1fr_max-content] gap-4 min-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
        <div className="w-full h-full bg-blue-200 rounded-lg">
          {position && (
            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle center={position} radius={15} pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 1 }} />
            </MapContainer>
          )}
        </div>
        <div className="w-1/4 min-w-80 h-full bg-white shadow-lg rounded-lg p-6">
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
