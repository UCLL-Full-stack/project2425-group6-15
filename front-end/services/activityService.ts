import { Activity } from "@/types";


const getAll = () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/activity", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
      },
    });
}
const getAllForAdmin = () => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/activity/admin", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
}
const removeActivity = async (eventId: number) => {
  let token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return await fetch(process.env.NEXT_PUBLIC_API_URL + `/activity/${eventId}`, {
    method: 'DELETE',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
    },
  });
};

export default { getAll,getAllForAdmin, removeActivity };