// components/TemplateForm.jsx
import React from "react";

const TemplateForm = ({ template, handleChange, handleSubmit, message }) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold mb-6">Create Template</h2>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          name="title"
          value={template.title}
          onChange={handleChange}
          placeholder="Template Title"
          className="p-4 rounded-md w-full border text-black"
          required
        />

        <input
          type="text"
          name="subject"
          value={template.subject}
          onChange={handleChange}
          placeholder="Email Subject"
          className="p-4 rounded-md w-full border text-black"
          required
        />

        <textarea
          name="content"
          value={template.content}
          onChange={handleChange}
          placeholder="Email Content"
          rows={8}
          className="p-4 rounded-md w-full border text-black"
          required
        />

        <div className="flex justify-between">
          <p className="text-sm">{message}</p>
          <button 
            className="px-4 py-3 rounded-lg bg-foreground text-background hover:bg-accent hover:text-white cursor-pointer" 
            onClick={handleSubmit}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;