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

const addInterestToUser = async (interest: { name: string; description: string }) => {
  const currentUser = await findCurrentUser();
  if (!currentUser || !currentUser.id) {
    throw new Error('Failed to fetch current user');
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/user/interests`, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
    body: JSON.stringify({ ...interest, userId: currentUser.id }),
  });

  if (!response.ok) {
    throw new Error(`Error adding interest: ${response.statusText}`);
  }

  const updatedUser = await response.json();
  return updatedUser;
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
  
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/current", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  };



export default { register, login, addInterestToUser, findUserByEmail, findCurrentUser };
