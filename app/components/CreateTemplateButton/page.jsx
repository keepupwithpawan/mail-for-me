// components/CreateTemplateButton.jsx
import { CirclePlus } from "lucide-react";

const CreateTemplateButton = ({ onClick }) => {
  return (
    <div
      className="template-create w-[23.7%] h-[50%] bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer transition hover:bg-gray-300"
      onClick={onClick}
    >
      <CirclePlus className="w-10 h-10" />
    </div>
  );
};

export default CreateTemplateButton;