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

const AdminScoreBoard = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const [users, setUsers] = useState<AccountSummary[]>([]);
    const [organizations, setOrganizations] = useState<AccountSummary[]>([]);
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

    const fetchAccounts = async () => {
        try {
            const response = await accountService.getAllAccounts();
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const data: AccountSummary[] = await response.json();
            setUsers(data.filter((user) => user.type === 'user'));
            setOrganizations(data.filter((user) => user.type === 'organization'));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchAccounts();
    }, []);




    return (
        <div className='w-fit px-6 py-5 bg-white border border-gray-200 rounded-xl flex items-center gap-5 justify-center'>
            <div className='w-40 h-28 flex flex-col gap-2 justify-center items-center'>
                <h1 className='text-4xl font-bold text-slate-700'>{users.length}</h1>
                <p className='text-lg font-medium text-slate-300'>actif users</p>
            </div>
            <div className='h-24 w-0.5 bg-gray-200 rounded-lg' />
            <div className='w-40 h-28 flex flex-col gap-2 justify-center items-center'>
                <h1 className='text-4xl font-bold text-slate-700'>{organizations.length}</h1>
                <p className='text-lg font-medium text-slate-300'>organizations</p>
            </div>
            <div className='h-24 w-0.5 bg-gray-200 rounded-lg' />
            <div className='w-40 h-28 flex flex-col gap-2 justify-center items-center'>
                <h1 className='text-4xl font-bold text-slate-700'>{events.length}</h1>
                <p className='text-lg font-medium text-slate-300'>events</p>
            </div>
        </div>
    );
};

export default AdminScoreBoard;