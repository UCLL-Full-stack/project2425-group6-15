import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import dashboardImg from '@/images/icons/admin/sidebar/dashboard.svg';
import usersImg from '@/images/icons/admin/sidebar/users.svg';
import eventsImg from '@/images/icons/admin/sidebar/events.svg';
import interestsImg from '@/images/icons/admin/sidebar/interests.svg';
import activitiesImg from '@/images/icons/admin/sidebar/activities.svg';

import dashboardActifImg from '@/images/icons/admin/sidebar/dashboardSelect.svg';
import usersActifImg from '@/images/icons/admin/sidebar/usersSelect.svg';
import eventsActifImg from '@/images/icons/admin/sidebar/eventsSelect.svg';
import interestsActifImg from '@/images/icons/admin/sidebar/interestsSelect.svg';
import activitiesActifImg from '@/images/icons/admin/sidebar/activitiesSelect.svg';

import logoutImg from '@/images/icons/admin/sidebar/logout.svg';
import logoutAcitfImg from '@/images/icons/admin/sidebar/logoutSelect.svg';

const Sidebar = () => {

    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const isSelected = (path: string) => (pathname.split("?")[0] === path);

    return (
        <div className="fixed left-0 top-0 h-screen w-64 grid grid-rows-[max-content_1fr_max-content] bg-white shadow-md">
            <div className='flex flex-col items-center p-4'>
                <h1 className="text-3xl w-fit font-normal text-blue-950"><strong className="font-bold">Join</strong>Me</h1>
                <h2 className='text-1xl font-normal text-slate-700'>Admin Panel</h2>
            </div>

            <div className='flex flex-col px-5 gap-1'>
                <Link href="/admin" className={`w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5 ${isSelected('/admin') ? 'bg-gray-100' : ''}`}>
                    <Image src={isSelected('/admin') ? dashboardActifImg : dashboardImg} alt="" className='w-8 h-8' />
                    <p className={`text-lg ${isSelected('/admin') ? 'text-blue-500' : 'text-slate-600'}`}>Dashboard</p>
                </Link>
                <Link href="/admin/users" className={`w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5 ${isSelected('/admin/users') ? 'bg-gray-100' : ''}`}>
                    <Image src={isSelected('/admin/users') ? usersActifImg : usersImg} alt="" className='w-8 h-8' />
                    <p className={`text-lg ${isSelected('/admin/users') ? 'text-blue-500' : 'text-slate-600'}`}>Users</p>
                </Link>
                <Link href="/admin/events" className={`w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5 ${isSelected('/admin/events') ? 'bg-gray-100' : ''}`}>
                    <Image src={isSelected('/admin/events') ? eventsActifImg : eventsImg} alt="" className='w-8 h-8' />
                    <p className={`text-lg ${isSelected('/admin/events') ? 'text-blue-500' : 'text-slate-600'}`}>Events</p>
                </Link>
                <Link href="/admin/interests" className={`w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5 ${isSelected('/admin/interests') ? 'bg-gray-100' : ''}`}>
                    <Image src={isSelected('/admin/interests') ? interestsActifImg : interestsImg} alt="" className='w-8 h-8' />
                    <p className={`text-lg ${isSelected('/admin/interests') ? 'text-blue-500' : 'text-slate-600'}`}>Interests</p>
                </Link>
                <Link href="/admin/activities" className={`w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5 ${isSelected('/admin/activities') ? 'bg-gray-100' : ''}`}>
                    <Image src={isSelected('/admin/activities') ? activitiesActifImg : activitiesImg} alt="" className='w-8 h-8' />
                    <p className={`text-lg ${isSelected('/admin/activities') ? 'text-blue-500' : 'text-slate-600'}`}>Activities</p>
                </Link>


            </div>
            <div className='flex flex-col'>
                <button onClick={() => {
                    sessionStorage.removeItem('token');
                    router.push('/');
                }} type="button" className={` group w-full flex items-center justify-between gap-2 rounded-lg hover:bg-gray-200 px-2 py-0.5`}>
                    <Image src={logoutImg} alt="" className='w-8 h-8 group-hover:hidden' />
                    <Image src={logoutAcitfImg} alt="" className='w-8 h-8 hidden group-hover:block' />
                    <p className={`text-lg text-slate-600  group-hover:text-red-500`}>Logout</p>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
