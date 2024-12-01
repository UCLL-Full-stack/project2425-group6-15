import Header from "@/components/header";
import Head from "next/head";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import postService from "@/services/postService";
import { Post } from "@/types/index";
import Sidebar from "@/components/dashboard/sidebar";
import { LatLngExpression } from "leaflet";

const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const Dashboard: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    });
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const response = await postService.getAllPosts();
    if (!response.ok) {
      throw new Error("Failed to load posts");
    }
    const posts = await response.json();
    setPosts(posts);
  }

  return (
    <>
      <Head>
        <title>JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <div className="container grid grid-cols-[1fr_370px] gap-4 h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
        <div className="w-full h-full bg-blue-200 rounded-lg">
          {position && (
            <MapContainerNoSSR center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayerNoSSR
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleNoSSR center={position} radius={15} pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 1 }} />
            </MapContainerNoSSR>
          )}
        </div>
        <Sidebar posts={ posts }/>
      </div>
    </>
  );
};

export default Dashboard;
