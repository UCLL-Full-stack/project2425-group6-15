// import dynamic from 'next/dynamic';
// import postService from '@/services/postService';
// import { Post } from '@/types';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import 'leaflet/dist/leaflet.css';
// import Header from '@/components/header/header';

// import { useTranslation } from "next-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { GetStaticProps } from "next";

// const MapContainerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
// const MarkerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
// const PopupNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
// const TileLayerNoSSR = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

// const PostPage = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [post, setPost] = useState<Post | null>(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await postService.getPostById(Number(id));
//         if (!response.ok) {
//           throw new Error("Failed to load post");
//         }
//         const post: Post = await response.json();
//         setPost(post);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (id) {
//       fetchPost();
//     }
//   }, [id]);

//   useEffect(() => {

//     if (typeof window !== 'undefined') {
//       const L = require('leaflet');
//       delete L.Icon.Default.prototype._getIconUrl;
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//         iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//         shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
//       });
//     }
//   }, []);

//   return (
//     <>
//       <Header />
//       {!post && <div>Loading...</div>}
//       {post && (
//         <div className='container grid grid-cols-[1fr_370px] gap-4 h-screen max-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3'>
//           <div className="w-full h-full bg-white rounded-lg" >
//             <h1 className="text-4xl font-extrabold text-center my-6 text-blue-600">{post.activity.name}</h1>
//             <p className="text-2xl font-semibold text-center my-4 text-gray-700">{post.participants.map(participant => participant.firstName).join(', ')}</p>
//             {typeof window !== 'undefined' && post.location && (
//               <MapContainerNoSSR center={[Number(post.location.latitude), Number(post.location.longitude)]} zoom={8} style={{ height: "400px", width: "100%" }}>
//                 <TileLayerNoSSR
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <MarkerNoSSR position={[Number(post.location.latitude), Number(post.location.longitude)]}>
//                   <PopupNoSSR>
//                     <h2>{post.title}</h2>
//                     <p>{post.description}</p>
//                   </PopupNoSSR>
//                 </MarkerNoSSR>
//               </MapContainerNoSSR>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? 'en', ['common'])),
//   },
// });

// export default PostPage;
