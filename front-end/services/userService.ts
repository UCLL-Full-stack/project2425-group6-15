import { UserRegistration, User, UserSummary } from "@/types";
import { console } from "inspector";




const addInterestToUser = async (interest: string[]) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + `/user/interests`, {
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
  
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/user/me", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
    });

  };



export default { addInterestToUser, findUserByEmail, findCurrentUser };
