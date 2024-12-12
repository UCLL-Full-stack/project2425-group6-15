import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import postService from '@/services/postService';
import { Post } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPostById(Number(id));
        if (!response.ok) {
          throw new Error("Failed to load post");
        }
        const post: Post = await response.json();
        setPost(post);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);
  return (
    <>
      {!post && <div>Loading...</div>}
      {post && (
        <div>
          <h1>{post.activity}</h1>
          <p>{post.content}</p>
          <MapContainer center={[post.location.latitude, post.location.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[post.location.latitude, post.location.longitude]}>
              <Popup>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </>
  );
};
export default PostPage;
