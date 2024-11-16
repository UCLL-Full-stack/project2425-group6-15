import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { response } from "express";
import { get } from "http";
import { getEmailByToken } from "@/util/user";
interface Interest {
    name: string;
    description: string;
  }
  
  const UserProfile: React.FC = () => {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [newInterest, setNewInterest] = useState<Interest>({ name: '', description: '' });

  const email =  getEmailByToken();
   
  
    useEffect(() => {
      const fetchInterests = async () => {
        const response = await userService.findUserByEmail(await email);
        if (response.ok) {
            setInterests(response.data.interests);
        }
        else{
            console.log('Error');
        
      }
    };
  
      fetchInterests();
    }, []);
  
    const addInterest = async () => {
      if (newInterest.name && newInterest.description) {
        const userResponse = await userService.findUserByEmail(await email);
        if (userResponse.ok) {
            const userId = userResponse.data.id;
            userService.addInterestToUser(userId, newInterest);
           
      }
      }}
  
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