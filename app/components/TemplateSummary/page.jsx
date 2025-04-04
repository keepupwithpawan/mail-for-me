// components/TemplateSummary.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // Adjust the import path as needed

const TemplateSummary = ({ template }) => {
  const [emails, setEmails] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // Load existing emails when template changes
  useEffect(() => {
    if (template?.recipient_emails) {
      setEmails(template.recipient_emails);
    } else {
      setEmails("");
    }
  }, [template]);

  const truncateTextLarger = (text, wordLimit = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const validateEmails = (emailString) => {
    if (!emailString) return true;

    const emailList = emailString.split(",").map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of emailList) {
      if (email && !emailRegex.test(email)) {
        setErrorMessage(`Invalid email format: ${email}`);
        return false;
      }
    }

    setErrorMessage("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmails(value);
    setIsValid(validateEmails(value));
  };

  const saveEmails = async () => {
    if (!isValid) return;

    setSaveStatus("Saving...");
    try {
      const { error } = await supabase
        .from("templates")
        .update({ recipient_emails: emails })
        .eq("id", template.id);

      if (error) {
        setSaveStatus(`Error: ${error.message}`);
      } else {
        setSaveStatus("Email addresses saved successfully!");
        // Clear status message after 3 seconds
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  const handleSendEmail = () => {
    // Create recipient string for mailto
    const recipientString = emails || "";
    window.open(
      `mailto:${encodeURIComponent(
        recipientString
      )}?subject=${encodeURIComponent(
        template?.subject
      )}&body=${encodeURIComponent(template?.content)}`
    );
  };

  return (
    // Wrapper with max height to ensure content is contained
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Email Recipients Section */}
      <div className="mt-6 mb-6">
        <h3 className="text-xl font-semibold">Recipients:</h3>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={emails}
            onChange={handleEmailChange}
            placeholder="Enter email addresses separated by commas"
            className={`p-3 rounded-md w-full border ${
              !isValid ? "border-red-500" : "border-gray-300"
            } text-black`}
          />
          <button
            onClick={saveEmails}
            disabled={!isValid}
            className="px-4 py-3 rounded-lg bg-foreground text-background hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
        {!isValid && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
        {saveStatus && (
          <p
            className={`text-sm mt-1 ${
              saveStatus.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {saveStatus}
          </p>
        )}
      </div>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Summary Box */}
        <div className="rounded-lg p-6 w-full">
          <h2 className="text-3xl font-semibold mb-4">Template Summary</h2>
          <h3 className="text-xl font-semibold">Title:</h3>
          <p className="mb-3">{template?.title}</p>

          <h3 className="text-xl font-semibold">Subject:</h3>
          <p className="mb-3">{template?.subject}</p>

          <h3 className="text-xl font-semibold">Content:</h3>
          <p className="mb-3">{truncateTextLarger(template?.content)}</p>
        </div>
      </div>

      {/* Fixed footer section for the button - always visible at bottom */}
      <div className="p-4 border-t mt-auto">
        <div className="flex flex-col items-center justify-center">
          <button
            className="px-5 py-3 bg-foreground text-background hover:bg-accent hover:text-white rounded-lg flex items-center justify-center gap-2 transition cursor-pointer w-auto"
            onClick={handleSendEmail}
            disabled={emails && !isValid}
          >
            <img
              src="https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000"
              alt=""
              className="w-8"
            />{" "}
            Send via Gmail
          </button>
          <p className="secondary-text mt-2 text-sm text-center">
            (Email will be sent via the Google Account signed in on this
            browser)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSummary;
