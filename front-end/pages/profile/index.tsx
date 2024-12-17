import Header from '@/components/header/header';
import ProfileOverview from '@/components/account/profileOvervieuw';

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const Profile: React.FC = () => {
    return (
        <>
            <Header />
            <div className="bg-slate-50 flex items-center justify-center w-full h-screen pt-24">
                <ProfileOverview />
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
});

export default Profile;