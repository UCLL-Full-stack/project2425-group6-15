import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActivitySummary, EventPreview, EventSummary, InterestSummary } from '@/types';

import DeleteImg from '@/images/icons/admin/delete.svg';
import interestService from '@/services/interestService';

const InterestsAdminTable = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;

    const [interests, setEvents] = useState<InterestSummary[]>([]);

    const fetchInterests = async () => {
        try {
            const response = await interestService.getAllForAdmin();
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
        fetchInterests();
    }, []);

    const deleteInterest = async (interestId: number) => {
        const confirmRemoval = confirm("Are you sure you want to delete this interest?");
        if (!confirmRemoval) return;
        try {
            const response = await interestService.removeInterest(interestId);
            if (response.ok) {
                fetchInterests();
                alert("Successfully deleted interest!");
            } else {
                const data = await response.json();
                alert("Failed to delete interest: " + data.message);
            }
        } catch (error) {
            console.error("An error occurred while removing the interest", error);
        }
    };

    return (
        <div className='w-full min-h-screen p-5 flex flex-col gap-5 justify-start items-center'>
            <table className='w-full max-w-3xl border rounded-xl box-border overflow-hidden shadow-md'>
                <thead className='bg-gray-800'>
                    <tr>
                        <th className='text-white text-lg font-normal p-2'>{t('interestName')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('type')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('used in interests')}</th>
                        <th className='text-white text-lg font-normal p-2'>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className='bg-white border border-gray-400'>
                    {interests.map((interest) => (
                        <tr key={interest.id} className='border-b border-gray-400'>
                            <td className='p-2'>{interest.name}</td>
                            <td className='p-2'>{interest.description}</td>
                            <td className='p-2'>{interest.accounts}</td>
                            <td className='p-2 flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => deleteInterest(interest.id as number)}
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

export default InterestsAdminTable;