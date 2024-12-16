import postService from "@/services/postService";
import { Gender, Post, PostPrevieuw, PostSummary } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import userService from "@/services/userService";
import interestService from "@/services/interestService";
import dynamic from 'next/dynamic';
import { LatLngExpression } from "leaflet";
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';


import filterimg from "@/images/icons/dashboard/filter.svg";
import CurrentlocImg from "@/images/icons/dashboard/currentlocation.svg";
import PinlocImg from "@/images/icons/dashboard/maplocation.svg";

const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const MarkerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const PopupNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const PostOverviewPopup = dynamic(() => import("@/components/posts/postOverviewPopup"), { ssr: false });

const postOverview: React.FC = () => {
  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [posts, setPosts] = useState<PostPrevieuw[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [filterLocationType, setFilterLocationType] = useState<"current" | "pin">("current");
  const [filterLocation, setFilterLocation] = useState<[number, number] | null>(null);
  const [filterRadius, setFilterRadius] = useState<number | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterAddress, setFilterAddress] = useState<string>("");
  const [filterSuggestions, setFilterSuggestions] = useState<string[]>([]);

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
    let posts = await response.json();
    posts = posts.filter((post: PostPrevieuw) => post.peopleNeeded > post.peopleJoined);

    setPosts(posts);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const postId = query.get("event");
    if (postId) {
      setSelectedPostId(Number(postId));
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filterLocation, filterRadius, filterStartDate, filterEndDate]);

  const handlePostClick = (postId: number) => {
    router.push(`?event=${postId}`, undefined, { shallow: true });
    setSelectedPostId(postId);
  };

  const closePopup = () => {
    loadPosts();
    router.push("", undefined, { shallow: true });
    setSelectedPostId(null);
  };

  const handleFilterAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterAddress(value);

    if (value.length > 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        .then(response => response.json())
        .then(data => {
          setFilterSuggestions(data.map((item: any) => item.display_name));
        });
    } else {
      setFilterSuggestions([]);
    }
  };

  const handleFilterSuggestionClick = (suggestion: string) => {
    setFilterAddress(suggestion);
    setFilterSuggestions([]);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${suggestion}`)
      .then(response => response.json())
      .then(data => {
        const location = data[0];
        const newCoords = { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
        setFilterLocation([newCoords.latitude, newCoords.longitude]);
      });
  };

  const handleFilterStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStartDate(new Date(e.target.value));
  };

  const handleFilterEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterEndDate(new Date(e.target.value));
  };

  const MapClickHandler: React.FC<{ setFilterLocation: (location: [number, number]) => void }> = ({ setFilterLocation }) => {
    useMapEvents({
      click(e) {
        setFilterLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <>
      {selectedPostId && <PostOverviewPopup postId={selectedPostId} onClose={closePopup} />}
      <div className="container grid grid-cols-[1fr_370px] gap-4 h-screen max-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
        <div className="w-full h-full bg-white rounded-lg">
          {position && (
            <MapContainerNoSSR center={position} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
              <TileLayerNoSSR
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleNoSSR center={position} radius={50} pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 1 }} />
              {posts.map(post => (
                <MarkerNoSSR key={post.id} position={[Number(post.location.latitude), Number(post.location.longitude)]}>
                  <PopupNoSSR>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <button onClick={() => post.id !== undefined && handlePostClick(post.id)}>View Post</button>
                  </PopupNoSSR>
                </MarkerNoSSR>
              ))}
              {filterLocation && (
                <MarkerNoSSR position={filterLocation} icon={new L.Icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                })}>
                  <PopupNoSSR>
                    <span>Pinned Location</span>
                  </PopupNoSSR>
                </MarkerNoSSR>
              )}
            </MapContainerNoSSR>
          )}
        </div>
        <div className="h-full box-border bg-white shadow-lg rounded-lg p-6 grid grid-rows-[auto_1fr] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-slate-700">Posts</h2>
            <button onClick={() => setShowFilter(!showFilter)} title="Filteren"><Image src={filterimg.src} alt="Image description" width={30} height={30} /></button>
            {showFilter && (
              <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-2">
                <div>
                  <p className="text-base text-gray-600">location</p>
                  <div className="flex items-center">
                    <button title="current location" className={`w-28 h-7 border border-gray-300 rounded-l-lg flex items-center justify-center ${filterLocationType === "current" ? "shadow-inner" : ""}`} onClick={() => setFilterLocationType("current")}>
                      <Image src={CurrentlocImg} alt="Image description" width={20} height={20} />
                    </button>
                    <button title="pin location" className={`w-28 h-7 border border-gray-300 rounded-r-lg flex items-center justify-center ${filterLocationType === "pin" ? "shadow-inner" : ""}`} onClick={() => setFilterLocationType("pin")}>
                      <Image src={PinlocImg} alt="Image description" width={20} height={20} />
                    </button>
                  </div>
                </div>

                {filterLocationType === "pin" && (
                  <div>
                    <input
                      type="text"
                      className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2"
                      title="Enter an address"
                      value={filterAddress}
                      onChange={handleFilterAddressChange}
                    />
                    {filterSuggestions.length > 0 && (
                      <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                        {filterSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleFilterSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-base text-gray-600">radius</p>
                <select className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2" title="Select a radius" onChange={(e) => setFilterRadius(Number(e.target.value))}>
                  <option value="5">5km</option>
                  <option value="7">7km</option>
                  <option value="8">8km</option>
                  <option value="10">10km</option>
                  <option value="20">20km</option>
                  <option value="all">all</option>
                </select>
                <p className="text-base text-gray-600">start date</p>
                <input type="date" className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2" title="Select a start date" onChange={handleFilterStartDateChange} />
                <p className="text-base text-gray-600">end date</p>
                <input type="date" className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2" title="Select an end date" onChange={handleFilterEndDateChange} />
              </div>
            )}
          </div>
          <div className="border-t-2 border-slate-600 w-full h-0 min-h-full max-h-full flex flex-col overflow-y-auto">
            {posts.length === 0 && <p className="text-slate-500">No posts available</p>}
            {position ? posts
              .filter(post => {
                if (filterLocationType === "pin" && filterLocation) {
                  const distance = Math.sqrt(
                    Math.pow(Number(post.location.latitude) - filterLocation[0], 2) +
                    Math.pow(Number(post.location.longitude) - filterLocation[1], 2)
                  );
                  return filterRadius === null || distance <= filterRadius;
                }
                return true;
              })
              .filter(post => {
                if (filterStartDate && filterEndDate) {
                  const postStartDate = new Date(post.startDate);
                  const postEndDate = new Date(post.endDate);
                  return postStartDate >= filterStartDate && postEndDate <= filterEndDate;
                }
                return true;
              })
              .sort((a, b) => {
                const distanceA = Math.sqrt(
                  Math.pow(Number(a.location.latitude) - position[0], 2) +
                  Math.pow(Number(a.location.longitude) - position[1], 2)
                );
                const distanceB = Math.sqrt(
                  Math.pow(Number(b.location.latitude) - position[0], 2) +
                  Math.pow(Number(b.location.longitude) - position[1], 2)
                );
                return distanceA - distanceB;
              })
              .map((post, index) => (
                <div
                  key={post.id}
                  className={`w-full h-20 ${index !== 0 ? 'border-t-2 border-slate-400' : ''} p-2 cursor-pointer `}
                  onClick={() => post.id !== undefined && handlePostClick(post.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-700">{post.title}</h3>
                    <p className={`text-sm ${post.hasJoined ? "text-green-400" : "text-slate-500"}`}>({post.peopleJoined}/{post.peopleNeeded})</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{post.description}</p>
                  </div>
                </div>
              ))
              : posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`w-full h-20 ${index !== 0 ? 'border-t-2 border-slate-400' : ''} p-2 cursor-pointer `}
                  onClick={() => post.id !== undefined && handlePostClick(post.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-700">{post.title}</h3>
                    <p className="text-sm text-slate-500">({post.peopleJoined}/{post.peopleNeeded})</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{post.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default postOverview;

