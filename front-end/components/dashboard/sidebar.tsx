import postService from "@/services/postService";
import { Gender, Post } from "@/types";
import React, { useState } from "react";
import { useRouter } from 'next/router';

interface ActivityTopOverviewProps {
  posts: Post[];
}

const ActivityTopOverview: React.FC<ActivityTopOverviewProps> = ({ posts }) => {
  const router = useRouter();

  return (
    <>
      <div className="h-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Sidebar</h2>
          <div className="w-full h-full flex flex-col">
            { posts.length === 0 && <p className="text-slate-500">No posts available</p> }
            {
              posts.map((post) => (
                <div key={post.id} className="w-full h-20 bg-blue-200 rounded-lg mb-2 cursor-pointer" onClick={() => router.push(`/dashboard/posts/${post.id}`)}>
                  <h3 className="text-lg font-semibold text-slate-700">{post.title}</h3>
                  <p className="text-sm text-slate-500">{post.description}</p>
                </div>
              ))
            }
          </div>
      </div>
    </>
  );
};

export default ActivityTopOverview;

