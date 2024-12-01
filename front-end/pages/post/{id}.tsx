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
            const post : Post = await response.json();
            setPost(post);
        }

    };
    if (id) {
      fetchPost();
    }
    
  }, [id]);



    return (
        <>
        { !post && <div>Loading...</div> }
        { post && (
            <div>
                <h1>{ post.activity }</h1>
                <p>{ post.content }</p>
            </div>
        )}
        </>
    );
};

export default PostPage;
