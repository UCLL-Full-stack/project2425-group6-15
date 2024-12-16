import { useState, useEffect } from "react";
import { useMapEvents, useMap } from 'react-leaflet';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import checkmarkImg from "@/images/icons/createpost/check.svg";

import { Location, Post } from "@/types/index";
import Image from "next/image";

interface CreateNewPostPopupProps {
    onClose(): void;
}

const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const MarkerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const CreateNewPostPopup: React.FC<CreateNewPostPopupProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [cordlocation, setcordLocation] = useState<{ longitude: number, latitude: number } | null>(null);
    const [address, setAddress] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [participants, setParticipants] = useState<number>(1);
    const [time, setTime] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [stepsCompleted, setStepsCompleted] = useState([false, false, false]);

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
        if (cordlocation) {
            // Fetch address from coordinates
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${cordlocation.latitude}&lon=${cordlocation.longitude}`)
                .then((response: Response) => response.json())
                .then((data: any) => {
                    setAddress(data.display_name);
                });
        }
    }, [cordlocation]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(value);

        if (value.length > 3) {
            // Fetch address suggestions
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
                .then(response => response.json())
                .then(data => {
                    setSuggestions(data.map((item: any) => item.display_name));
                });
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setAddress(suggestion);
        setSuggestions([]);

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${suggestion}`)
            .then(response => response.json())
            .then(data => {
                const location = data[0];
                const newCoords = { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
                setcordLocation(newCoords);
            });
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                setcordLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
                map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom());
            },
        });

        return cordlocation === null ? null : (
            <MarkerNoSSR position={[cordlocation.latitude, cordlocation.longitude]}></MarkerNoSSR>
        );
    };

    const FlyToLocation: React.FC<{ coords: { latitude: number, longitude: number } }> = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            map.flyTo([coords.latitude, coords.longitude], map.getZoom());
        }, [coords, map]);
        return null;
    };

    const validateSteps = () => {
        const stepsCalculateCompleted = [false, false, false];

        // Step 0: Title and Description
        if (title.trim() !== "" && description.trim() !== "") {
            stepsCalculateCompleted[0] = true;
        }

        // Step 1: Date and Location
        if (address.trim() !== "" && cordlocation !== null) {
            stepsCalculateCompleted[1] = true;
        }

        // Step 2: Participants and Time
        if (participants > 0 && time.trim() !== "") {
            stepsCalculateCompleted[2] = true;
        }

        setStepsCompleted(stepsCalculateCompleted);
    };

    useEffect(() => {
        validateSteps();
    }, [title, description, address, cordlocation, participants, time]);

    const handleNextStep = () => {
        validateSteps();
        if (stepsCompleted[currentStep]) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div className="bg-black bg-opacity-50 z-[999] fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-white px-4 py-2 flex flex-col gap-2 relative rounded-xl w-10/12 max-w-xl min-w-96">
                <button onClick={onClose} className="absolute top-1 right-3 text-xl text-gray-500">
                    &#9587;
                </button>
                <h3 className="text-xl font-medium text-slate-600">Create New Post</h3>
                <div className="flex justify-center items-center">
                    <button
                        onClick={() => setCurrentStep(0)}
                        title="Name and description"
                        className={`w-6 h-6 border-blue-500 border-2 rounded ${stepsCompleted[0] ? 'bg-blue-400' : ''}`}
                    >
                        <Image src={checkmarkImg} alt="checkmark" width={20} height={20} />
                    </button>
                    <div className={`w-12 h-3 border-blue-500 border-y-2 ${stepsCompleted[0] && stepsCompleted[1] ? 'bg-blue-400' : ''}`} />
                    <button onClick={() => setCurrentStep(1)} title="when and where" className={`w-6 h-6 border-blue-500 border-2 rounded ${stepsCompleted[1] ? 'bg-blue-400' : ''}`}>
                        <Image src={checkmarkImg} alt="checkmark" width={20} height={20} />
                    </button>
                    <div className={`w-12 h-3 border-blue-500 border-y-2 ${stepsCompleted[1] && stepsCompleted[2] ? 'bg-blue-400' : ''}`} />
                    <button onClick={() => setCurrentStep(2)} title="with how many and how late" className={`w-6 h-6 border-blue-500 border-2 rounded ${stepsCompleted[2] ? 'bg-blue-400' : ''}`}>
                        <Image src={checkmarkImg} alt="checkmark" width={20} height={20} />
                    </button>
                    <div className="w-12 h-3 border-blue-500 border-y-2 " />
                    <div className="w-8 h-8 border-blue-500 border-2 rounded" />
                </div>
                {currentStep === 0 && (
                    <div className="flex flex-col gap-2">
                        <div>
                            <label htmlFor="postTitle" className="text-base text-slate-600">Post Title</label>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} id="postTitle" type="text" placeholder="Enter a title." className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                        </div>
                        <div>
                            <label htmlFor="postDescription" className="text-base text-slate-600">Post Description</label>
                            <textarea onChange={(e) => setDescription(e.target.value)} value={description} id="postDescription" placeholder="Enter a description." className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base min-h-44" />
                        </div>
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <label htmlFor="startDate" className="text-base text-slate-600">Start date</label>
                                <input onChange={(e) => setStartDate(e.target.value)} value={startDate} id="startDate" type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="text-base text-slate-600">End date</label>
                                <input onChange={(e) => setEndDate(e.target.value)} value={endDate} id="endDate" type="date" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="postTime" className="text-base text-slate-600">Meeting Time</label>
                            <input onChange={(e) => setTime(e.target.value)} value={time} id="postTime" type="time" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                        </div>
                        <div>
                            <label htmlFor="postLocation" className="text-base text-slate-600">Post Location</label>
                            <input
                                id="postLocation"
                                type="text"
                                placeholder="Enter an address."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base"
                                value={address}
                                onChange={handleAddressChange}
                            />
                            {suggestions.length > 0 && (
                                <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="h-64">
                            {typeof window !== 'undefined' && (
                                <MapContainerNoSSR center={[51.505, -0.09]} zoom={13} className="h-full">
                                    <TileLayerNoSSR
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker />
                                    {cordlocation && <FlyToLocation coords={cordlocation} />}
                                </MapContainerNoSSR>
                            )}
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="flex flex-col gap-2">
                        <div>
                            <label htmlFor="postParticipants" className="text-base text-slate-600">Post Participants</label>
                            <div className="flex items-center justify-between">
                                <input
                                    type="number"
                                    onChange={(e) => setParticipants(Number(e.target.value))}
                                    value={participants}
                                    className="w-12 appearance-none outline-none border border-gray-300 rounded-lg p-1 no-spinner"
                                    title="Number of participants"
                                    min="1"
                                    max="50"
                                />

                                <input
                                    id="postParticipants"
                                    type="range"
                                    min="1"
                                    max="50"
                                    className="w-full ml-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    onChange={(e) => setParticipants(Number(e.target.value))}
                                    value={participants}
                                />
                            </div>

                        </div>

                    </div>
                )}
                <div className="w-full flex items-center justify-between">
                    <button
                        onClick={handlePreviousStep}
                        className="px-2 py-0.5 border border-gray-300 rounded-lg text-base text-gray-700 hover:border-gray-600"
                    >
                        previous step
                    </button>
                    <button
                        onClick={handleNextStep}
                        className="px-2 py-0.5 border border-gray-300 rounded-lg text-base text-gray-700 hover:border-gray-600"
                    >
                        next step
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateNewPostPopup;
