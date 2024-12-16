import { useState, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import checkmarkImg from "@/images/icons/createpost/check.svg";

import { Location, Post, PostSummary } from "@/types/index";
import Image from "next/image";
import postService from "@/services/postService";
import { Use } from "@svgdotjs/svg.js";

interface CreateNewPostPopupProps {
  postId: number;
  onClose(): void;
}

const MapContainerNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayerNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const MarkerNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const fetchNearestAddress = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  );
  if (!response.ok) {
    console.error("Failed to fetch address");
    return null;
  }
  const data = await response.json();
  return data.display_name;
};

const joinpost = async (postId: number) => {
  try {
    const response = await postService.joinPost(postId);
    if (response.ok) {
      alert("Successfully joined the post!");
    } else {
      console.error("Failed to join the post");
    }
  } catch (error) {
    console.error("An error occurred while joining the post", error);
  }
};

const PostOverviewPopup: React.FC<CreateNewPostPopupProps> = ({
  onClose,
  postId,
}) => {
  const [post, setPost] = useState<PostSummary | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const fetchPost = async () => {
    const response = await postService.getPostById(postId);
    if (!response.ok) {
      console.error("Failed to fetch post");
    }
    const data = await response.json();
    setPost(data);
    if (data.location) {
      const nearestAddress = await fetchNearestAddress(
        data.location.latitude,
        data.location.longitude
      );
      setAddress(nearestAddress);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="bg-black bg-opacity-50 z-[999] fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white px-4 py-2 flex flex-col gap-0 relative rounded-xl w-10/12 max-w-xl min-w-96">
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-xl text-gray-500"
        >
          &#9587;
        </button>
        {post && (
          <>
            <h3 className="text-xl font-medium text-slate-700">
              {post?.title}
            </h3>
            <p className="text-sm text-gray-400">
              By @{post?.creator?.firstName} {post?.creator?.lastName}
            </p>
            <div className="pt-4 grid grid-cols-2 gap-2">
              <div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700">
                    Address
                  </h4>
                  <p className="text-sm text-gray-400">{address}</p>
                </div>
                <div>
                  <MapContainerNoSSR
                    center={[
                      Number(post.location.latitude),
                      Number(post.location.longitude),
                    ]}
                    zoom={7}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayerNoSSR
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {post?.location && (
                      <MarkerNoSSR
                        position={[
                          Number(post.location.latitude),
                          Number(post.location.longitude),
                        ]}
                      />
                    )}
                  </MapContainerNoSSR>
                </div>
                {post?.location && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${post.location.latitude},${post.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 text-center"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-slate-700">
                    Description
                  </h4>
                  <p className="text-sm text-gray-400">{post?.description}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">
                    {post?.location
                      ? `${post.location.latitude}, ${post.location.longitude}`
                      : ""}
                  </p>
                  <p className="text-sm text-gray-400"></p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <button
                className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded-full px-4 py-2 transition-all duration-300 ease-in-out hover:bg-blue-600"
                onClick={() => joinpost(postId)}
              >
                <Image
                  src={checkmarkImg}
                  alt="Checkmark Icon"
                  width={20}
                  height={20}
                />
                Join
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostOverviewPopup;
