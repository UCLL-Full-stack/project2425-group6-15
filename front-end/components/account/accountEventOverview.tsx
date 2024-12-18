import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from "next-i18next";
import { PublicAccount } from "@/types";
import accountService from "@/services/accountService";
import L from "leaflet";

const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const MarkerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const PopupNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const PostOverviewPopup = dynamic(() => import("@/components/event/postOverviewPopup"), { ssr: false });


const AccountEventOverview: React.FC = () => {
    const { t } = useTranslation();
    const [accountData, setAccountData] = useState<PublicAccount | null>(null);
    const [addresses, setAddresses] = useState<{ [key: string]: string }>({});
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            });
        }
    }, []);

    const fetchMe = async () => {
        const response = await accountService.findCurrentAccount();
        if (!response.ok) {
            console.log('error');
        }
        const data = await response.json();
        setAccountData(data);
    }

    const fetchNearestAddress = async (latitude: number, longitude: number, eventId: string) => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        if (!response.ok) {
            console.error("Failed to fetch address");
            return;
        }
        const data = await response.json();
        if (!data.address) {
            console.error("Failed to fetch address");
            return;
        }
        console.log(data);
        const address = `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.city || data.address.town || data.address.village || ''}, ${data.address.country || ''}`;
        setAddresses(prev => ({ ...prev, [eventId]: address }));
    };

    const closePopup = () => {
        setSelectedEventId(null);
    }

    useEffect(() => {
        fetchMe();
    }, []);

    useEffect(() => {
        if (accountData) {
            accountData.events.forEach(event => {
                fetchNearestAddress(Number(event.location.latitude), Number(event.location.longitude), event.id.toString());
            });
        }
    }, [accountData]);
    if (!accountData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="w-full h-full flex flex-col gap-4">
            {selectedEventId && <PostOverviewPopup postId={selectedEventId} onClose={closePopup} />}
            <div className="w-full h-fit flex flex-col gap-x-2 gap-y-4 bg-white border border-gray-200 rounded-xl px-4 py-2">
                <div className="grid grid-cols-[max-content,1fr] gap-2 items-center">
                    <h1 className="text-2xl font-bold text-slate-700">Jouw Toekomstige Events</h1>
                    <div className='w-full h-0.5 bg-slate-300 rounded' />
                </div>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                    {accountData.events.filter(event => new Date(event.endDate) > new Date()).map((event) => (
                        <button onClick={(e) => setSelectedEventId(event.id)} key={event.id} className="flex border-gray-200 border rounded-lg flex-col gap-2 w-64 h-64">
                            <div className="w-full h-fit relative rounded-lg">
                                <MapContainerNoSSR
                                    center={[
                                        Number(event.location.latitude),
                                        Number(event.location.longitude),
                                    ]}
                                    zoom={7}
                                    style={{ height: "200px", width: "100%" }}
                                    className="rounded-lg z-0"
                                >
                                    <TileLayerNoSSR
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {event?.location && (
                                        <MarkerNoSSR position={[
                                            Number(event.location.latitude),
                                            Number(event.location.longitude),
                                        ]}
                                            icon={new L.Icon({
                                                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                                                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                                            })}>
                                            <PopupNoSSR>
                                                <span className="text-xs">{addresses[event.id]}</span>
                                            </PopupNoSSR>
                                        </MarkerNoSSR>
                                    )}
                                </MapContainerNoSSR>
                            </div>
                            <div className="flex flex-col gap-2 px-2 overflow-hidden">
                                <div className="flex flex-row items-center justify-between overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{event.title}</p>
                                    <p className="text-sm text-slate-300">({event.participants.length}/{event.peopleNeeded})</p>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{event.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full h-fit flex flex-col gap-x-2 gap-y-4 bg-white border border-gray-200 rounded-xl px-4 py-2">
                <div className="grid grid-cols-[max-content,1fr] gap-2 items-center">
                    <h1 className="text-2xl font-bold text-slate-700">Jouw achterliggende Events</h1>
                    <div className='w-full h-0.5 bg-slate-300 rounded' />
                </div>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                    {accountData.events.filter(event => new Date(event.endDate) < new Date()).map((event) => (
                        <div key={event.id} className="flex border-gray-200 border rounded-lg flex-col gap-2 w-64 h-64">
                            <div className="w-full h-fit relative rounded-lg">
                                <MapContainerNoSSR
                                    center={[
                                        Number(event.location.latitude),
                                        Number(event.location.longitude),
                                    ]}
                                    zoom={7}
                                    style={{ height: "200px", width: "100%" }}
                                    className="rounded-lg z-0"
                                >
                                    <TileLayerNoSSR
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {event?.location && (
                                        <MarkerNoSSR position={[
                                            Number(event.location.latitude),
                                            Number(event.location.longitude),
                                        ]}
                                            icon={new L.Icon({
                                                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                                                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                                            })}>
                                            <PopupNoSSR>
                                                <span className="text-xs">{addresses[event.id]}</span>
                                            </PopupNoSSR>
                                        </MarkerNoSSR>
                                    )}
                                </MapContainerNoSSR>
                            </div>
                            <div className="flex flex-col gap-2 px-2 overflow-hidden">
                                <div className="flex flex-row items-center justify-between overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{event.title}</p>
                                    <p className="text-sm text-slate-300">({event.participants.length}/{event.peopleNeeded})</p>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full h-fit flex flex-col gap-x-2 gap-y-4 bg-white border border-gray-200 rounded-xl px-4 py-2">
                <div className="grid grid-cols-[max-content,1fr] gap-2 items-center">
                    <h1 className="text-2xl font-bold text-slate-700">Jouw gejoinede Events</h1>
                    <div className='w-full h-0.5 bg-slate-300 rounded' />
                </div>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                    {accountData.joinedEvents.filter(event => new Date(event.endDate) > new Date()).map((event) => (
                        <div key={event.id} className="flex border-gray-200 border rounded-lg flex-col gap-2 w-64 h-64">
                            <div className="w-full h-fit relative rounded-lg">
                                <MapContainerNoSSR
                                    center={[
                                        Number(event.location.latitude),
                                        Number(event.location.longitude),
                                    ]}
                                    zoom={7}
                                    style={{ height: "200px", width: "100%" }}
                                    className="rounded-lg z-0"
                                >
                                    <TileLayerNoSSR
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {event?.location && (
                                        <MarkerNoSSR position={[
                                            Number(event.location.latitude),
                                            Number(event.location.longitude),
                                        ]}
                                            icon={new L.Icon({
                                                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                                                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                                            })}>
                                            <PopupNoSSR>
                                                <span className="text-xs">{addresses[event.id]}</span>
                                            </PopupNoSSR>
                                        </MarkerNoSSR>
                                    )}
                                </MapContainerNoSSR>
                            </div>
                            <div className="flex flex-col gap-2 px-2 overflow-hidden">
                                <div className="flex flex-row items-center justify-between overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{event.title}</p>
                                    <p className="text-sm text-slate-300">({event.participants.length}/{event.peopleNeeded})</p>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                    {accountData.joinedEvents.filter(event => new Date(event.endDate) < new Date()).map((event) => (
                        <div key={event.id} className="flex border-gray-200 border opacity-50 rounded-lg flex-col gap-2 w-64 h-64">
                            <div className="w-full h-fit relative rounded-lg">
                                <MapContainerNoSSR
                                    center={[
                                        Number(event.location.latitude),
                                        Number(event.location.longitude),
                                    ]}
                                    zoom={7}
                                    style={{ height: "200px", width: "100%" }}
                                    className="rounded-lg z-0"
                                >
                                    <TileLayerNoSSR
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {event?.location && (
                                        <MarkerNoSSR position={[
                                            Number(event.location.latitude),
                                            Number(event.location.longitude),
                                        ]}
                                            icon={new L.Icon({
                                                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                                                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                                            })}>
                                            <PopupNoSSR>
                                                <span className="text-xs">{addresses[event.id]}</span>
                                            </PopupNoSSR>
                                        </MarkerNoSSR>
                                    )}
                                </MapContainerNoSSR>
                            </div>
                            <div className="flex flex-col gap-2 px-2 overflow-hidden">
                                <div className="flex flex-row items-center justify-between overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{event.title}</p>
                                    <p className="text-sm text-slate-300">({event.participants.length}/{event.peopleNeeded})</p>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccountEventOverview;
