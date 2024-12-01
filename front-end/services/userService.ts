import { UserRegistration, User, UserSummary } from "@/types";

const register = (user: UserRegistration) => {
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
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      
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

const findCurrentUser = async () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/user/current", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};



export default { register, login,addInterestToUser,findUserByEmail, findCurrentUser };
