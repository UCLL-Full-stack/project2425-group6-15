import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MessageHandler: React.FC = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"error" | "succes" | null>(null);
    const router = useRouter();

    useEffect(() => {
        const query = router.query;
        if (query.errorMessage) {
            setMessage(query.errorMessage as string);
            setMessageType("error");
        } else if (query.succesMessage) {
            setMessage(query.succesMessage as string);
            setMessageType("succes");
        }

        const timer = setTimeout(() => {
            const { pathname, query } = router;
            delete query.errorMessage;
            delete query.succesMessage;
            router.replace({ pathname, query }, undefined, { shallow: true });
            setMessage("");
            setMessageType(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);
    if (messageType === null) {
        return null;
    }
    return (
        <div className={`messagePopup text-white ${messageType === "error" ? "bg-red-500" : "bg-green-500"}`}>
            {message}
        </div>
    );
};

export default MessageHandler;