// components/TemplateSummary.jsx
import React from "react";

const TemplateSummary = ({ template }) => {
  const truncateTextLarger = (text, wordLimit = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  const handleSendEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(template?.subject)}&body=${encodeURIComponent(template?.content)}`);
  };

  return (
    <>
      {/* Top Section - Summary Box */}
      <div className="rounded-lg p-6 w-full mt-4 mb-10">
        <h2 className="text-3xl font-semibold mb-4">Template Summary</h2>
        <h3 className="text-xl font-semibold">Title:</h3>
        <p className="mb-3">{template?.title}</p>

        <h3 className="text-xl font-semibold">Subject:</h3>
        <p className="mb-3">{template?.subject}</p>

        <h3 className="text-xl font-semibold">Content:</h3>
        <p className="mb-3">{truncateTextLarger(template?.content)}</p>
      </div>

      {/* Bottom Section - Email Button */}
      <div className="flex flex-col items-center justify-center">
        <button
          className="px-5 py-3 bg-foreground text-background hover:bg-accent hover:text-white rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
          onClick={handleSendEmail}
        >
          <img src="https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000" alt="" className="w-8" /> Send via Gmail
        </button>
        <p className="secondary-text mt-4 text-sm text-center">
          (Email will be sent via the Google Account signed in on this browser)
        </p>
      </div>
    </>
  );
};

export default TemplateSummary;