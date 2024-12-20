import { useState, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import checkmarkImg from "@/images/icons/createpost/check.svg";
import exitImg from "@/images/icons/createpost/exit.svg";
import removeImg from "@/images/icons/createpost/remove.svg";
import editImg from "@/images/icons/createpost/edit.svg";
import { useTranslation } from "next-i18next";
import { PublicEvent, EventSummary, PublicAccount } from "@/types/index";
import Image from "next/image";
import eventService from "@/services/eventService";
import { Use } from "@svgdotjs/svg.js";
import accountService from "@/services/accountService";
import EditEventPopup from "./editEventPopup";
import { set } from "date-fns";
import { useRouter } from "next/router";

interface CreateNewPostPopupProps {
  eventId: number;
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

const fetchNearestAddress = async (latitude: number, longitude: number, router: any) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    if (!response.ok) {
      const error = await response.json();
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
      return null;
    }
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    router.push({
      pathname: router.pathname,
      query: { errorMessage: String(error) }
    });
  }
};

const PostOverviewPopup: React.FC<CreateNewPostPopupProps> = ({

  onClose,
  eventId,
}) => {
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [currentAccount, setcurrentAccount] = useState<PublicAccount | null>(null);
  const [showedit, setShowedit] = useState<boolean>(false);
  const router = useRouter();

  const fetchAccount = async () => {
    try {
      const response = await accountService.findCurrentAccount();
      if (!response.ok) {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) }
        });
        return;
      }
      const data = await response.json();
      setcurrentAccount(data);
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
    }
  }

  const removeEvent = async (eventId: number) => {
    const confirmRemoval = confirm(t("admin.notifications.events.sure"));
    if (!confirmRemoval) return;
    try {
      const response = await eventService.removeEvent(eventId);
      if (response.ok) {
        router.push({
          pathname: router.pathname,
          query: { succesMessage: String(t("admin.notifications.events.success")) }
        });
        onClose();
      } else {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) }
        });
      }
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
    }
  };
  const fetchPost = async () => {
    try {
      const response = await eventService.getPostById(eventId);
      if (!response.ok) {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) }
        });
      }
      const data = await response.json();
      setEvent(data);
      if (data.location) {
        const nearestAddress = await fetchNearestAddress(
          data.location.latitude,
          data.location.longitude,
          router
        );
        setAddress(nearestAddress);
      }
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchPost();
  }, []);

  const joinEvent = async (eventId: number) => {
    try {
      const response = await eventService.joinPost(eventId);
      if (response.ok) {
        fetchPost();
        router.push({
          pathname: router.pathname,
          query: { succesMessage: String(t("admin.notifications.events.join")) }
        });
      } else {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) }
        });
      }
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
    }
  };
  const exitEvent = async (eventId: number) => {
    try {
      const response = await eventService.exitPost(eventId);
      if (response.ok) {
        fetchPost();
        router.push({
          pathname: router.pathname,
          query: { succesMessage: String(t("admin.notifications.events.exit")) }
        });
      } else {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) }
        });
      }
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) }
      });
    }
  }

  const closeEdit = () => {
    setShowedit(false);
    fetchPost();
  }
  if (showedit) {
    return <EditEventPopup eventId={eventId} onClose={closeEdit} />;
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
        {event && currentAccount && (
          <>
            <h3 className="text-xl font-medium text-slate-700">
              {event?.title}
            </h3>
            <p className="text-sm text-gray-400">
              {t("events.by")} @{event?.creator?.firstName} {event?.creator?.lastName}
            </p>
            <div className="pt-4 grid grid-cols-2 gap-2">
              <div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700">
                    {t("events.address")}
                  </h4>
                  <p className="text-sm text-gray-400 flex">{address}</p>
                </div>
                <div>
                  <MapContainerNoSSR
                    center={[
                      Number(event.location.latitude),
                      Number(event.location.longitude),
                    ]}
                    zoom={7}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayerNoSSR
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {event?.location && (
                      <MarkerNoSSR
                        position={[
                          Number(event.location.latitude),
                          Number(event.location.longitude),
                        ]}
                      />
                    )}
                  </MapContainerNoSSR>
                </div>
                {event?.location && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${event.location.latitude},${event.location.longitude}`}
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
                    {t("events.timespan")}
                  </h4>
                  <div className="flex flex-col">
                    <div className="grid grid-cols-[max-content_1fr_max-content] items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                      <div className="w-full h-1 bg-gray-300" />
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400 text-start">
                        <p>{new Date(event.startDate).toLocaleTimeString()}</p>
                        <p>{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-gray-400 text-end">
                        <p>{new Date(event.endDate).toLocaleTimeString()}</p>
                        <p>{new Date(event.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-slate-700">
                    {t("events.create.description")}
                  </h4>
                  <p className="text-sm text-gray-400">{event?.description}</p>
                </div>
                {currentAccount.id === event.creator.id && (
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-slate-700">
                      {t("events.create.participants")}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {event?.participants?.map((participant) => (
                        <p className="text-sm text-gray-400">{participant.firstName} {participant.lastName}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {(event.creator.id != currentAccount.id && new Date(event.startDate) > new Date()) && (
              <div className="w-full flex items-center justify-end">
                {!event.hasJoined && (
                  <button
                    className="flex items-center justify-center gap-1.5 border-blue-500 border-2 text-blue-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                    onClick={() => joinEvent(eventId)}
                  >
                    <Image
                      src={checkmarkImg}
                      alt="Checkmark Icon"
                      width={20}
                      height={20}
                    />
                    {t("events.create.join")}
                  </button>
                )}
                {event.hasJoined && (
                  <button
                    className="flex items-center justify-center gap-1.5 border-red-500 border-2 text-red-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                    onClick={() => exitEvent(eventId)}
                  >
                    <Image
                      src={exitImg}
                      alt="cros Icon"
                      width={20}
                      height={20}
                    />
                    {t("events.create.leave")}
                  </button>
                )}
              </div>
            )}

            {(event.creator.id == currentAccount.id && new Date(event.startDate) > new Date(new Date().setHours(new Date().getHours() + 12))) && (
              <div className="w-full flex items-center justify-end gap-2">
                <button
                  className="flex items-center justify-center gap-1.5 border-red-500 border-2 text-red-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                  onClick={() => removeEvent(eventId)}
                >
                  <Image
                    src={removeImg}
                    alt="cros Icon"
                    width={20}
                    height={20}
                  />
                  {t("events.delete")}
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 border-blue-500 border-2 text-blue-500 rounded-full px-4 py-2 transition-all duration-300 ease-in-out "
                  onClick={() => (setShowedit(true))}
                >
                  <Image
                    src={editImg}
                    alt="Checkmark Icon"
                    width={20}
                    height={20}
                  />
                  {t("events.edit")}
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
