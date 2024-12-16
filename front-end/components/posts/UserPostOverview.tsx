import { PostPrevieuw } from "@/types";
import React, { useState, useEffect } from "react";
import userService from "@/services/userService";
import { useTranslation } from "react-i18next"; // Add this import

const UserPostOverview: React.FC = () => {
  const [posts, setPosts] = useState<PostPrevieuw[]>([]);
  const { t } = useTranslation(); // Add this line
  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    const response = await userService.findCurrentUser();
    if (!response.ok) {
      throw new Error("Failed to load user posts");
    }
    const userData = await response.json();
    setPosts(userData.posts);
  };

  return (
    <>
      <div className="container grid grid-cols-1 gap-4 h-screen max-h-screen min-w-full text-gray-800 box-border pt-24 pb-5 px-3">
        <div className="h-full box-border bg-white shadow-lg rounded-lg p-6 grid grid-rows-[auto_1fr]">
          <div className="flex items-center justify-between relative">
            <h2 className="text-3xl font-semibold text-slate-700">
              {t("posts.title")}
            </h2>
          </div>
          <div className="border-t-2 border-slate-600 w-full h-0 min-h-full max-h-full flex flex-col overflow-y-auto">
            {posts.length === 0 && (
              <p className="text-slate-500"> {t("posts.no_post")}</p>
            )}
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`w-full h-20 ${
                  index !== 0 ? "border-t-2 border-slate-400" : ""
                } p-2 cursor-pointer `}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    ({post.peopleJoined}/{post.peopleNeeded})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPostOverview;
