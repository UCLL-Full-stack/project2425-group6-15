import userService from "@/services/userService";
import { Gender } from "@/types";
import React, { useState } from "react";
import { useRouter } from 'next/router';

const ActivityTopOverview: React.FC = () => {
  const router = useRouter();

    const activities = await activityService.getTopActivities();

  return (
    <>
      <ul>

      </ul>
    </>
  );
};

export default ActivityTopOverview;
