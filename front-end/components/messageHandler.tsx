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
        <div className={`fixed z-[999999] top-3 w-fit left-1/2 transform -translate-x-1/2 text-white px-2 py-0.5 rounded-lg ${messageType === "error" ? "bg-red-500" : "bg-green-500"}`}>
            {message}
        </div>
    );
};

export default MessageHandler;