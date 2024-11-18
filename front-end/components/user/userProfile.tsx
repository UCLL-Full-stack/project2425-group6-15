<<<<<<< HEAD
import userService from "@/services/userService";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { response } from "express";
import { get } from "http";
import { getEmailByToken } from "@/util/user";
import { User } from "@/types";
interface Interest {
    name: string;
    description: string;
  }
  
  const UserProfile: React.FC = () => {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [newInterest, setNewInterest] = useState<Interest>({ name: '', description: '' });
    const [User, setUser] = useState<User>({} as User);
    
    useEffect(() => {
      const fetchUser = async () => {
=======
import { useState, useEffect } from 'react';
import userService from '@/services/userService';
import { UserSummary } from '@/types';

interface Interest {
  name: string;
  description: string;
}

const UserProfile: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState<Interest>({ name: '', description: '' });
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
>>>>>>> 42c508ebacc0ddf3d283747efd04475904501612
        const response = await userService.findCurrentUser();
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setInterests(data.interests);
        } else {
          console.log('Error fetching user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
<<<<<<< HEAD
    }
    fetchUser();
  });
 
    const addInterest = async () => {
      if (newInterest.name && newInterest.description) {
        const response = await userService.addInterestToUser(, newInterest);
=======
    };

    fetchUser();
  }, []);

  const addInterest = async () => {
    if (newInterest.name && newInterest.description && user && user.id !== undefined) {
      try {
        const response = await userService.addInterestToUser(user.id, newInterest);
>>>>>>> 42c508ebacc0ddf3d283747efd04475904501612
        if (response.ok) {
          setInterests([...interests, newInterest]);
          setNewInterest({ name: '', description: '' });
        } else {
          console.log('Error adding interest:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding interest:', error);
      }
    } else {
      console.log('User ID is undefined');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Interests</h2>
        <ul className="list-disc pl-5">
          {interests.map((interest, index) => (
            <li key={index}>
              <strong>{interest.name}</strong>: {interest.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Add New Interest</h2>
        <input
          type="text"
          placeholder="Interest Name"
          value={newInterest.name}
          onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Interest Description"
          value={newInterest.description}
          onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={addInterest} className="bg-blue-500 text-white p-2 rounded">
          Add Interest
        </button>
      </div>
    </div>
  );
};

export default UserProfile;