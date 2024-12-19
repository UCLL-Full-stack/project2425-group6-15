import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import eventService from '@/services/eventService';
import { EventPreview, EventSummary } from '@/types';

import DeleteImg from '@/images/icons/admin/delete.svg';

const EventsAdminTable = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const [events, setEvents] = useState<EventPreview[]>([]);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllPosts();
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const deleteEvent = async (eventId: number) => {
        const confirmRemoval = confirm("Are you sure you want to delete this event?");
        if (!confirmRemoval) return;
        try {
            const response = await eventService.removeEvent(eventId);
            if (response.ok) {
                fetchEvents();
                alert("Successfully deleted event!");
            } else {
                const data = await response.json();
                alert("Failed to delete event: " + data.message);
            }
        } catch (error) {
            console.error("An error occurred while removing the event", error);
        }
    };

    return (
        <div className='w-full min-h-screen p-5 flex flex-col gap-5 justify-start items-center'>
            <table className='w-full max-w-3xl border rounded-xl box-border overflow-hidden shadow-md'>
                <thead className='bg-gray-800'>
                    <tr>
                        <th className='text-white text-lg font-normal p-2'>{t('eventName')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('creator')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('time')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className='bg-white border border-gray-400'>
                    {events.map((event) => (
                        <tr key={event.id} className='border-b border-gray-400'>
                            <td className='p-2'>{event.title}</td>
                            <td className='p-2'>{event.creator.username}</td>
                            <td className='p-2'>
                                <div className=' flex items-center justify-between'>
                                    <div className="text-sm text-gray-400 text-start">
                                        <p>{new Date(event.startDate).toLocaleTimeString()}</p>
                                        <p>{new Date(event.startDate).toLocaleDateString()}</p>
                                    </div>
                                    -&gt;
                                    <div className="text-sm text-gray-400 text-end">
                                        <p>{new Date(event.endDate).toLocaleTimeString()}</p>
                                        <p>{new Date(event.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                            </td>
                            <td className='p-2 flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => deleteEvent(event.id as number)}
                                    className=' text-white rounded px-2 py-1 hover:bg-gray-100 transition duration-300'
                                    title={t('delete')}>
                                    <Image src={DeleteImg} alt='' className='w-5 h-5' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventsAdminTable;