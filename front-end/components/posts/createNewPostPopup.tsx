import { useState } from "react";

interface CreateNewPostPopupProps {
    onClose(): void;
}
const CreateNewPostPopup: React.FC<CreateNewPostPopupProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    return (
        <div className="bg-black bg-opacity-50 z-[999] absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-white p-4 flex flex-col gap-2 relative">
                <button onClick={onClose} className="absolute top-1 right-1 text-2xl text-gray-500">
                    &#9587;
                </button>
                <h3>Create New Post</h3>
                <div className="flex justify-center items-center">
                    <div className="w-2 h-2 border-blue-500 border-2 rounded-full" />

                </div>
            </div>
        </div>
    );
}

export default CreateNewPostPopup;
