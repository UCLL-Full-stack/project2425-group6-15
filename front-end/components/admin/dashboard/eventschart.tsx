import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AccountSummary, ActivitySummary, EventPreview, EventSummary } from '@/types';

import DeleteImg from '@/images/icons/admin/delete.svg';
import activityService from '@/services/activityService';
import eventService from '@/services/eventService';
import accountService from '@/services/accountService';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminEventsChart = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const [events, setEvents] = useState<EventPreview[]>([]);
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const months = [
        (t('month.january')),
        (t('month.february')),
        (t('month.march')),
        (t('month.april')),
        (t('month.may')),
        (t('month.june')),
        (t('month.july')),
        (t('month.august')),
        (t('month.september')),
        (t('month.october')),
        (t('month.november')),
        (t('month.december')),
    ];

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

    const eventsPerMonth = Array(12).fill(0);
    events.forEach(event => {
        const eventDate = new Date(event.startDate);
        if (eventDate.getFullYear() === year) {
            eventsPerMonth[eventDate.getMonth()]++;
        }
    });

    const data = {
        labels: months,
        datasets: [
            {
                label: t('Number of Events'),
                data: eventsPerMonth,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (tickValue: string | number) {
                        if (typeof tickValue === 'number' && Number.isInteger(tickValue)) {
                            return tickValue;
                        }
                        return null;
                    }
                }
            }
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className='w-full max-w-2xl px-6 py-5 bg-white border border-gray-200 rounded-xl flex-row items-center gap-5 justify-center'>
            <h1 className='text-2xl font-semibold text-center text-slate-600'>Monthly Events</h1>
            <div className='flex items-center gap-5 justify-center'>
                <button
                    className='text-2xl font-thin text-slate-500'
                    onClick={() => { setYear(year - 1) }}
                >
                    &lt;
                </button>
                <h2
                    className='text-1xl font-thin text-slate-500'
                >{year}</h2>
                <button
                    className='text-2xl font-thin text-slate-500'
                    onClick={() => { setYear(year + 1) }}
                >
                    &gt;
                </button>
            </div>
            <div>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default AdminEventsChart;