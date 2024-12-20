import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActivitySummary, EventPreview, EventSummary } from '@/types';

import DeleteImg from '@/images/icons/admin/delete.svg';
import activityService from '@/services/activityService';

const ActivitiesAdminTable = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const [activitys, setEvents] = useState<ActivitySummary[]>([]);

    const fetchActivities = async () => {
        try {
            const response = await activityService.getAllForAdmin();
            if (!response.ok) {
                const error = await response.json();
                router.push({
                    pathname: router.pathname,
                    query: { errorMessage: String(error.message) }
                });
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(error) }
            });
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const deleteActivitie = async (activityId: number) => {
        const confirmRemoval = confirm("Are you sure you want to delete this activity?");
        if (!confirmRemoval) return;
        try {
            const response = await activityService.removeActivity(activityId);
            if (response.ok) {
                fetchActivities();
                router.push({
                    pathname: router.pathname,
                    query: { succesMessage: String("Activity succesfull deleted.") }
                });
            } else {
                const data = await response.json();
                router.push({
                    pathname: router.pathname,
                    query: { errorMessage: String(data.message) }
                });
            }
        } catch (error) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(error) }
            });
        }
    };

    return (
        <div className='w-full min-h-screen p-5 flex flex-col gap-5 justify-start items-center'>
            <table className='w-full max-w-3xl border rounded-xl box-border overflow-hidden shadow-md'>
                <thead className='bg-gray-800'>
                    <tr>
                        <th className='text-white text-lg font-normal p-2'>{t('activityName')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('type')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('used in activitys')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className='bg-white border border-gray-400'>
                    {activitys.map((activity) => (
                        <tr key={activity.id} className='border-b border-gray-400'>
                            <td className='p-2'>{activity.name}</td>
                            <td className='p-2'>{activity.type}</td>
                            <td className='p-2'>{activity.events}</td>
                            <td className='p-2 flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => deleteActivitie(activity.id as number)}
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

export default ActivitiesAdminTable;