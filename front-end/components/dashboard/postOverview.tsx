import postService from "@/services/postService";
import { Gender, Post } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import userService from "@/services/userService";
import interestService from "@/services/interestService";
import dynamic from 'next/dynamic';
import { LatLngExpression } from "leaflet";
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';

import filterimg from "@/images/icons/dashboard/filter.svg";


const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const postOverview: React.FC = () => {
  const router = useRouter();
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <div className="container grid grid-cols-[1fr_370px] gap-4 h-screen max-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
        <div className="w-full h-full bg-white rounded-lg">
          {position && (
            <MapContainerNoSSR center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayerNoSSR
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleNoSSR center={position} radius={15} pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 1 }} />
            </MapContainerNoSSR>
          )}
        </div>
        <div className="h-full box-border bg-white shadow-lg rounded-lg p-6 grid grid-rows-[auto_1fr]">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-slate-700">Posts</h2>
            <button title="Filteren"><Image src={filterimg.src} alt="Image description" width={30} height={30} /></button>
          </div>
          <div className="border-t-2 border-slate-600 w-full h-0 min-h-full max-h-full flex flex-col overflow-y-auto">
            {posts.length === 0 && <p className="text-slate-500">No posts available</p>}
            {posts.map((post, index) => (
              <div
              key={post.id}
              className={`w-full h-20 ${index !== 0 ? 'border-t-2 border-slate-400' : ''} p-2 cursor-pointer`}
              onClick={() => router.push(`/dashboard/posts/${post.id}`)}
              >
              <h3 className="text-lg font-semibold text-slate-700">{post.title}</h3>
              <p className="text-sm text-slate-500">{post.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default postOverview;

