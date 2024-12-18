import { useState, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import checkmarkImg from "@/images/icons/createpost/check.svg";
import exitImg from "@/images/icons/createpost/exit.svg";
import removeImg from "@/images/icons/createpost/remove.svg";
import editImg from "@/images/icons/createpost/edit.svg";

import { PublicEvent, EventSummary, PublicAccount } from "@/types/index";
import Image from "next/image";
import eventService from "@/services/eventService";
import { Use } from "@svgdotjs/svg.js";
import accountService from "@/services/accountService";

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

const PostOverviewPopup: React.FC<CreateNewPostPopupProps> = ({
  onClose,
  postId,
}) => {
  const [post, setPost] = useState<EventSummary | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [currentAccount, setcurrentAccount] = useState<PublicAccount | null>(null);

  const fetchAccount = async () => {
    const response = await accountService.findCurrentAccount();
    if (!response.ok) {
      console.error("Failed to fetch account");
    }
    const data = await response.json();
    setcurrentAccount(data);
  }

  const removeEvent = async (eventId: number) => {
    const confirmRemoval = confirm("Are you sure you want to remove this event?");
    if (!confirmRemoval) return;
    try {
      const response = await eventService.removeEvent(eventId);
      if (response.ok) {
        alert("Successfully removed the event!");
        onClose();
      } else {
        console.error("Failed to remove the event");
      }
    } catch (error) {
      console.error("An error occurred while removing the event", error);
    }
  };
  const fetchPost = async () => {
    const response = await eventService.getPostById(postId);
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
    fetchAccount();
    fetchPost();
  }, []);

  const joinpost = async (postId: number) => {
    try {
      const response = await eventService.joinPost(postId);
      if (response.ok) {
        fetchPost();
        alert("Successfully joined the post!");
      } else {
        console.error("Failed to join the post");
      }
    } catch (error) {
      console.error("An error occurred while joining the post", error);
    }
  };
  const exitpost = async (postId: number) => {
    try {
      const response = await eventService.exitPost(postId);
      if (response.ok) {
        fetchPost();
        alert("Successfully exited the post!");
      } else {
        console.error("Failed to exit the post");
      }
    } catch (error) {
      console.error("An error occurred while exiting the post", error);
    }
  }


  return (
    <div className="bg-black bg-opacity-50 z-[999] fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-white px-4 py-2 flex flex-col gap-0 relative rounded-xl w-10/12 max-w-xl min-w-96">
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-xl text-gray-500"
        >
          &#9587;
        </button>
        {post && currentAccount && (
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
                  <p className="text-sm text-gray-400 flex">{address}</p>
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
                    Hour
                  </h4>
                  <div className="flex flex-col">
                    <div className="grid grid-cols-[max-content_1fr_max-content] items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                      <div className="w-full h-1 bg-gray-300" />
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400 text-start">
                        <p>{new Date(post.startDate).toLocaleTimeString()}</p>
                        <p>{new Date(post.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-gray-400 text-end">
                        <p>{new Date(post.endDate).toLocaleTimeString()}</p>
                        <p>{new Date(post.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-slate-700">
                    Description
                  </h4>
                  <p className="text-sm text-gray-400">{post?.description}</p>
                </div>

              </div>
            </div>
            {(post.creator.id != currentAccount.id && new Date(post.startDate) > new Date()) && (
              <div className="w-full flex items-center justify-end">
                {!post.hasJoined && (
                  <button
                    className="flex items-center justify-center gap-1.5 border-blue-500 border-2 text-blue-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                    onClick={() => joinpost(postId)}
                  >
                    <Image
                      src={checkmarkImg}
                      alt="Checkmark Icon"
                      width={20}
                      height={20}
                    />
                    schrijf in
                  </button>
                )}
                {post.hasJoined && (
                  <button
                    className="flex items-center justify-center gap-1.5 border-red-500 border-2 text-red-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                    onClick={() => exitpost(postId)}
                  >
                    <Image
                      src={exitImg}
                      alt="cros Icon"
                      width={20}
                      height={20}
                    />
                    schrijf uit
                  </button>
                )}
              </div>
            )}

            {(post.creator.id == currentAccount.id && new Date(post.startDate) > new Date(new Date().setHours(new Date().getHours() + 12))) && (
              <div className="w-full flex items-center justify-end gap-2">
                <button
                  className="flex items-center justify-center gap-1.5 border-red-500 border-2 text-red-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                  onClick={() => removeEvent(postId)}
                >
                  <Image
                    src={removeImg}
                    alt="cros Icon"
                    width={20}
                    height={20}
                  />
                  verwijder
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 border-blue-500 border-2 text-blue-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                  onClick={() => (postId)}
                >
                  <Image
                    src={editImg}
                    alt="Checkmark Icon"
                    width={20}
                    height={20}
                  />
                  bewerk
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostOverviewPopup;
