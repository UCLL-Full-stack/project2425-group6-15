import { RegisterUser, User, UserSummary } from "@/types";

const register = (user: RegisterUser) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
      body: JSON.stringify(user),
    });
  };
  
const login = (user: { email: string; password: string }) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
      body: JSON.stringify(user),
    });
  };

  const addInterestToUser= (userId: number, interest:{name: string; description: string})  => {

    return fetch(process.env.NEXT_PUBLIC_API_URL + `/${userId}/interests`, {

      method: 'POST',

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

      },

      body: JSON.stringify(interest),

    });

  };


  const findUserByEmail = async (email:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error('User not found');
    }

    const user = await response.json();




    return user;
  };



export default { register, login,addInterestToUser,findUserByEmail};
