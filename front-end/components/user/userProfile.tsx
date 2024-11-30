import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { User } from "@/types";

interface Interest {
    name: string;
    description: string;
}

const UserProfile: React.FC = () => {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [newInterest, setNewInterest] = useState<Interest>({ name: '', description: '' });
    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.findCurrentUser();
                setUser(data);
                setInterests(data.interests);
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const addInterest = async () => {
        if (newInterest.name && newInterest.description) {
            try {
                const updatedUser = await userService.addInterestToUser(newInterest);
                setInterests(updatedUser.interests);
                setNewInterest({ name: '', description: '' });
            } catch (error) {
                console.error('Error adding interest:', error);
            }
        } else {
            console.log('Interest name and description are required');
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