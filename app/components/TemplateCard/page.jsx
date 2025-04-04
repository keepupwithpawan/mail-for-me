// components/TemplateCard.jsx
import React from "react";

const TemplateCard = ({ template, onClick }) => {
  const truncateText = (text, wordLimit = 20) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return (
    <div
      className="template-item w-[23.7%] h-[50%] bg-gray-200 text-foreground dark:text-background rounded-2xl flex flex-col p-6 cursor-pointer transition hover:bg-gray-300"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-5">{truncateText(template.title)}</h3>
      <p className="text-l">{truncateText(template.subject)}</p>
      <p className="text-sm mt-3">{truncateText(template.content)}</p>
    </div>
  );
};

export default TemplateCard;