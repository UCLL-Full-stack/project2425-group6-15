import { decode } from "jsonwebtoken";

const TokenRefresh = async () => {
    let token = sessionStorage.getItem("token");
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(process.env.NEXT_PUBLIC_API_KEY && { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }),
        },
    });
    if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        return true;
    } else {
        return false;
    }
}


const TokenHandler = async () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
        return false;
    }
    const decodedToken = decode(token);
    if (!decodedToken || typeof decodedToken === 'string' || !('exp' in decodedToken)) {
        return false;
    }
    let timeleft = 0
    if (decodedToken.exp) {
        timeleft = decodedToken.exp - Date.now() / 1000;
        timeleft *= 1000;
    } else {
        return false;
    }
    if (timeleft > 120) {
        setTimeout(() => {
            TokenRefresh();
        }, (timeleft - 120));
        return true;
    }
    if (timeleft <= 0) {
        return false;
        
    }
    if (timeleft <= 120) {
        TokenRefresh()
    }
}

export default TokenHandler;