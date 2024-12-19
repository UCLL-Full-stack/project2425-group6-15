import eventService from "@/services/eventService";
import { EventPreview } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import dynamic from 'next/dynamic';
import Image from 'next/image';

import filterimg from "@/images/icons/dashboard/filter.svg";

const PostOverviewPopup = dynamic(() => import("@/components/event/eventOverviewPopup"), { ssr: false });

const EventCalendar: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [events, setEvents] = useState<EventPreview[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const response = await eventService.getAllEvents();
        if (!response.ok) {
            throw new Error("Failed to load events");
        }
        let events = await response.json();
        events = events.filter((event: EventPreview) => new Date(event.startDate) > new Date())
        setEvents(events);
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const eventId = query.get("event");
        if (eventId) {
            setSelectedPostId(Number(eventId));
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [filterStartDate, filterEndDate]);

    const handlePostClick = (eventId: number) => {
        router.push(`?event=${eventId}`, undefined, { shallow: true });
        setSelectedPostId(eventId);
    };

    const closePopup = () => {
        loadPosts();
        router.push("", undefined, { shallow: true });
        setSelectedPostId(null);
    };

    const handleFilterStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterStartDate(new Date(e.target.value));
    };

    const handleFilterEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterEndDate(new Date(e.target.value));
    };

    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        const startOfWeek = today.getDate() - today.getDay();
        for (let i = 0; i < 7; i++) {
            const day = new Date(today.setDate(startOfWeek + i));
            days.push(day);
        }
        return days;
    };

    return (
        <>
            {selectedPostId && <PostOverviewPopup eventId={selectedPostId} onClose={closePopup} />}
            <div className="container grid grid-cols-7 gap-4 h-screen max-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
                {getWeekDays().map((day, index) => (
                    <div key={index} className="w-full h-full bg-white rounded-lg shadow-lg p-2">
                        <h3 className="text-lg font-semibold text-slate-700">{day.toDateString()}</h3>
                        {events
                            .filter(event => {
                                const eventDate = new Date(event.startDate);
                                return eventDate.toDateString() === day.toDateString();
                            })
                            .map(event => (
                                <div
                                    key={event.id}
                                    className="w-full h-20 p-2 cursor-pointer border-t-2 border-slate-400"
                                    onClick={() => event.id !== undefined && handlePostClick(event.id)}
                                >
                                    <h4 className="text-md font-semibold text-slate-700">{event.title}</h4>
                                    <p className="text-sm text-slate-500">{event.description}</p>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
            <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-2">
                <button onClick={() => setShowFilter(!showFilter)} title="Filteren"><Image src={filterimg.src} alt="Image description" width={30} height={30} /></button>
                {showFilter && (
                    <>
                        <p className="text-lg text-gray-600">{t("filter.between")}</p>
                        <p className="text-base text-gray-600">{t("filter.date1")}</p>
                        <input type="date" className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2" title="Select a start date" onChange={handleFilterStartDateChange} />
                        <p className="text-base text-gray-600">{t("filter.date2")}</p>
                        <input type="date" className="w-full h-7 border border-gray-300 rounded-lg py-1 px-2" title="Select an end date" onChange={handleFilterEndDateChange} />
                    </>
                )}
            </div>
        </>
    );
};

export default EventCalendar;

