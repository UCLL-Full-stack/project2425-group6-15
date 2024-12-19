import { useState, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "next-i18next";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { EventInput } from "@/types/index";

import checkmarkImg from "@/images/icons/createpost/check.svg";

import Image from "next/image";
import activityService from "@/services/activityService";
import { Activity } from "@/types";
import { set } from "date-fns";
import eventService from "@/services/eventService";

interface CreateNewPostPopupProps {
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

const CreateNewPostPopup: React.FC<CreateNewPostPopupProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [cordlocation, setcordLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [participants, setParticipants] = useState<number>(1);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [stepsCompleted, setStepsCompleted] = useState([false, false, false]);

  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    const response = await activityService.getAll();
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    setActivities(await response.json());
  }

  const handleSelect = (ranges: any) => {
    setDateRange([ranges.selection]);
  };
  useEffect(() => {
    fetchActivities();
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    }
  }, []);

  useEffect(() => {
    if (cordlocation) {
      // Fetch address from coordinates
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${cordlocation.latitude}&lon=${cordlocation.longitude}`
      )
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
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.map((item: any) => item.display_name));
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion);
    setSuggestions([]);

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${suggestion}`
    )
      .then((response) => response.json())
      .then((data) => {
        const location = data[0];
        const newCoords = {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        };
        setcordLocation(newCoords);
      });
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setActivity(value);
    const filteredActivities = activities
      .filter((act) => act.name.toLowerCase().includes(value.toLowerCase()))
      .map((act) => act.name);
    setSuggestions(filteredActivities);
  };

  const handleActivitySuggestionClick = (suggestion: string) => {
    setActivity(suggestion);
    setSuggestions([]);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setcordLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom());
      },
    });

    return cordlocation === null ? null : (
      <MarkerNoSSR
        position={[cordlocation.latitude, cordlocation.longitude]}
      ></MarkerNoSSR>
    );
  };

  const FlyToLocation: React.FC<{
    coords: { latitude: number; longitude: number };
  }> = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([coords.latitude, coords.longitude], map.getZoom());
    }, [coords, map]);
    return null;
  };

  const validateSteps = () => {
    const stepsCalculateCompleted = [false, false, false, false];

    // Step 0: Title and Description
    if (title.trim() !== "" && description.trim() !== "") {
      stepsCalculateCompleted[0] = true;
    }

    // Step 1: Activity & participants
    if (activity.trim() !== "" && activities.some((act) => act.name === activity)) {
      stepsCalculateCompleted[1] = true;
    }
    // Step 2: Location
    if (address.trim() !== "" && cordlocation !== null) {
      stepsCalculateCompleted[2] = true;
    }

    // Step 3: Location
    if (startDateTime.trim() !== "" && endDateTime.trim() !== "") {
      stepsCalculateCompleted[3] = true;
    }

    // Step 4: correcting
    if (currentStep === 4) {
      stepsCalculateCompleted[4] = true;
    } else {
      stepsCalculateCompleted[4] = false;
    }

    setStepsCompleted(stepsCalculateCompleted);
  };

  const handleCreateEvent = async () => {
    if (!cordlocation) {
      // Handle the case where cordlocation is null
      console.error("Location is not set");
      return;
    }

    const event: EventInput = {
      title,
      description,
      startDate: new Date(startDateTime),
      endDate: new Date(endDateTime),
      location: {
        longitude: cordlocation.longitude.toString(),
        latitude: cordlocation.latitude.toString(),
      },
      activityName: activity,
      peopleNeeded: participants,
    };
    const response = await eventService.createEvent(event);
    if (!response.ok) {
      console.error("Failed to create event");
      return;
    }
    onClose();
  }

  useEffect(() => {
    validateSteps();
  }, [title, description, address, cordlocation, participants, activity, startDateTime, endDateTime, currentStep]);

  useEffect(() => {
    setStartDateTime("")
    setEndDateTime("")

    if (startTime === "" || endTime === "" || dateRange.length === 0) {
      return;
    }

    let startDate = dateRange[0].startDate;
    let endDate = dateRange[0].endDate;
    let testStartDateTime = new Date(`${startDate.toDateString()} ${startTime}`);
    let testEndDateTime = new Date(`${endDate.toDateString()} ${endTime}`);

    if (testStartDateTime < testEndDateTime) {
      setStartDateTime(testStartDateTime.toString());
      setEndDateTime(testEndDateTime.toString());
    }
  }, [startTime, endTime, dateRange]);


  const handleNextStep = () => {
    validateSteps();
    if (stepsCompleted[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-black bg-opacity-50 z-[999] fixed top-0 left-0 w-full h-full flex justify-center items-center">
      {currentStep < 4 && (
        <div className="bg-white px-4 py-2 flex flex-col gap-2 relative rounded-xl max-w-xl min-w-96">
          <button
            onClick={onClose}
            className="absolute top-1 right-3 text-xl text-gray-500"
          >
            &#9587;
          </button>
          <h3 className="text-xl font-medium text-slate-600">
            {t("events.create.title")}
          </h3>
          <div className="flex justify-center items-center">
            <div
              title="Name and description"
              className={`w-4 h-4 rounded-full ${stepsCompleted[0] ? "bg-blue-400" : "bg-gray-300"
                }`}
            >
            </div>
            <div
              className={`w-12 h-1 ${stepsCompleted[0] && stepsCompleted[1] ? "bg-blue-400" : "bg-gray-300"
                }`}
            />
            <div
              title="when and where"
              className={`w-4 h-4 rounded-full ${stepsCompleted[1] ? "bg-blue-400" : "bg-gray-300"
                }`}
            >
            </div>
            <div
              className={`w-12 h-1 ${stepsCompleted[1] && stepsCompleted[2] ? "bg-blue-400" : "bg-gray-300"
                }`}
            />
            <div
              title="with how many and how late"
              className={`w-4 h-4 rounded-full ${stepsCompleted[2] ? "bg-blue-400" : "bg-gray-300"
                }`}
            >
            </div>
            <div
              className={`w-12 h-1 ${stepsCompleted[2] && stepsCompleted[3] ? "bg-blue-400" : "bg-gray-300"
                }`}
            />
            <div
              title="Name and description"
              className={`w-4 h-4 rounded-full ${stepsCompleted[3] ? "bg-blue-400" : "bg-gray-300"
                }`}
            >
            </div>

          </div>
          {currentStep === 0 && (
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="eventTitle" className="text-base text-slate-600">
                  {t("events.create.name")}
                </label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  id="eventTitle"
                  type="text"
                  placeholder={t("events.create.name")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="eventDescription"
                  className="text-base text-slate-600"
                >
                  {t("events.create.description")}
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  id="eventDescription"
                  placeholder={t("events.create.description")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base min-h-44"
                />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="eventParticipants" className="text-base text-slate-600">
                  {t("events.create.participants")}
                </label>
                <div className="grid grid-cols-[25px_1fr] items-center gap-2">
                  <div className="text-right">{participants}</div>
                  <input
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    value={participants}
                    id="eventParticipants"
                    type="range"
                    min="1"
                    max="50"
                    className="w-full appearance-none bg-gray-200 rounded-lg overflow-hidden accent-blue-500 h-2.5"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="eventActivity" className="text-base text-slate-600">
                  {t("events.create.activity")}
                </label>
                <input
                  onChange={handleActivityChange}
                  value={activity}
                  id="eventActivity"
                  type="text"
                  placeholder={t("events.create.activity")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base"
                />
                {suggestions.length > 0 && (
                  <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleActivitySuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="eventLocation"
                  className="text-base text-slate-600"
                >
                  {t("events.create.location")}
                </label>
                <input
                  id="eventLocation"
                  type="text"
                  placeholder={t("events.create.location")}
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
                {typeof window !== "undefined" && (
                  <MapContainerNoSSR
                    center={[51.505, -0.09]}
                    zoom={13}
                    className="h-full"
                  >
                    <TileLayerNoSSR url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                    {cordlocation && <FlyToLocation coords={cordlocation} />}
                  </MapContainerNoSSR>
                )}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="eventPeriod">{t("events.create.period")}</label>
              <DateRange
                ranges={dateRange}
                onChange={handleSelect}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                months={1}
                direction="vertical"
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex flex-col gap-0">
                  <label htmlFor="startTime">{t("events.startTime")}</label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border rounded p-2"
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <label htmlFor="endTime">{t("events.endTime")}</label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border rounded p-2"
                  />
                </div>

              </div>
            </div>
          )}
          <div className="w-full flex items-center justify-between">
            <button
              onClick={handlePreviousStep}
              className={`px-2 py-0.5 border border-gray-300 rounded-lg text-base text-gray-700 hover:border-gray-600 ${currentStep === 0 ? "opacity-20 cursor-default" : ""}`}
            >
              {t("events.create.previous")}
            </button>
            <button
              onClick={handleNextStep}
              className="px-2 py-0.5 border border-gray-300 rounded-lg text-base text-gray-700 hover:border-gray-600"
            >
              {currentStep === 3 ? t("events.create.overview") : t("events.create.next")}
            </button>
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div className="bg-white px-4 py-2 flex flex-col gap-2 relative rounded-xl max-w-xl min-w-96">
          <h2 className="text-2xl font-semibold mb-4">{t("events.create.overviewTitle")}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="eventTitle" className="text-lg font-medium text-slate-600">
                {t("events.create.name")}
              </label>
              <p className="text-base text-slate-800">{title}</p>
            </div>
            <div>
              <label
                htmlFor="eventDescription"
                className="text-lg font-medium text-slate-600"
              >
                {t("events.create.description")}
              </label>
              <p className="text-base text-slate-800">{description}</p>
            </div>
            <div>
              <label htmlFor="eventParticipants" className="text-lg font-medium text-slate-600">
                {t("events.create.participants")}
              </label>
              <p className="text-base text-slate-800">{participants}</p>
            </div>
            <div>
              <label htmlFor="eventActivity" className="text-lg font-medium text-slate-600">
                {t("events.create.activity")}
              </label>
              <p className="text-base text-slate-800">{activity}</p>
            </div>
            <div>
              <label
                htmlFor="eventLocation"
                className="text-lg font-medium text-slate-600"
              >
                {t("events.create.location")}
              </label>
              <p className="text-base text-slate-800">{address}</p>
              <div className="h-64 mt-2">
                {typeof window !== "undefined" && cordlocation && (
                  <MapContainerNoSSR
                    center={[cordlocation.latitude, cordlocation.longitude]}
                    zoom={13}
                    className="h-full rounded-lg"
                  >
                    <TileLayerNoSSR url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MarkerNoSSR position={[cordlocation.latitude, cordlocation.longitude]} />
                  </MapContainerNoSSR>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="eventPeriod" className="text-lg font-medium text-slate-600">
                {t("events.create.period")}
              </label>
              <p className="text-base text-slate-800">{startDateTime}</p>
              <p className="text-base text-slate-800">{endDateTime}</p>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-700 hover:border-gray-600"
            >
              {t("events.create.edit")}
            </button>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600"
            >
              {t("events.create.create")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewPostPopup;
