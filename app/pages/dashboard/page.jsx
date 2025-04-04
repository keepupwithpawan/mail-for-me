// page.jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../components/Navbar/page";
import Footer from "../../components/Footer/page";

// Import the newly created components
import TemplateCard from "../../components/TemplateCard/page";
import SkeletonTemplateCard from "../../components/SkeletonTemplateCard/page";
import CreateTemplateButton from "../../components/CreateTemplateButton/page";
import TemplateForm from "../../components/TemplateForm/page";
import TemplateSummary from "../../components/TemplateSummary/page";
import ExpandedModal from "../../components/ExpandedModal/page";

// Import animations CSS
import "../../animations.css";

export default function Dashboard() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState("");
    const [template, setTemplate] = useState({ title: "", subject: "", content: "" });
    const [templatesList, setTemplatesList] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [animationClass, setAnimationClass] = useState("");
    const [clickPosition, setClickPosition] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from("templates").select("*").order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching templates:", error.message);
            } else {
                setTemplatesList(data);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setTemplate({ ...template, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Submitting...");

        const { data, error } = await supabase.from("templates").insert([
            {
                title: template.title,
                subject: template.subject,
                content: template.content,
            },
        ]);

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage("Data submitted successfully!");
            setTemplate({ title: "", subject: "", content: "" });
            fetchTemplates(); // Refresh the templates list
            closeExpanded();
        }
    };

    const openTemplate = (template, e) => {
        // Get click position for animation origin
        const rect = e.currentTarget.getBoundingClientRect();
        setClickPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        
        setSelectedTemplate(template);
        setIsCreating(false);
        setAnimationClass("animate-expand");
        setIsExpanded(true);
        
        // Update CSS variable for transform origin
        document.documentElement.style.setProperty('--click-x', `${rect.left + rect.width / 2}px`);
        document.documentElement.style.setProperty('--click-y', `${rect.top + rect.height / 2}px`);
    };

    const openCreateTemplate = (e) => {
        // Get click position for animation origin
        const rect = e.currentTarget.getBoundingClientRect();
        setClickPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        
        setSelectedTemplate(null);
        setIsCreating(true);
        setAnimationClass("animate-expand");
        setIsExpanded(true);
        
        // Update CSS variable for transform origin
        document.documentElement.style.setProperty('--click-x', `${rect.left + rect.width / 2}px`);
        document.documentElement.style.setProperty('--click-y', `${rect.top + rect.height / 2}px`);
    };

    const closeExpanded = () => {
        setAnimationClass("animate-collapse");
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            setIsExpanded(false);
            setIsCreating(false);
            setSelectedTemplate(null);
        }, 300); // Match the animation duration
    };

    return (
        <>
            <Navbar />

            {/* Main Content */}
            <div className="lander w-full h-[80vh] m-auto flex-col items-center justify-center relative">
                <div className="main-container w-[90%] h-full m-auto">
                    <div className="heading-container">
                        <h1 className="text-6xl mb-2">Dashboard</h1>
                        <p className="secondary-text text-xl">Create and manage your Templates</p>
                    </div>

                    {/* Templates Section */}
                    <div className="w-full h-full mt-5 flex flex-wrap gap-5">
                        {isLoading ? (
                            // Show skeleton loaders while loading
                            <>
                                <SkeletonTemplateCard />
                                <SkeletonTemplateCard />
                                <div className="template-create w-[23.7%] h-[50%] bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                </div>
                            </>
                        ) : (
                            // Show actual templates when loaded
                            <>
                                {templatesList.map((item) => (
                                    <TemplateCard 
                                        key={item.id} 
                                        template={item} 
                                        onClick={(e) => openTemplate(item, e)} 
                                    />
                                ))}

                                <CreateTemplateButton onClick={openCreateTemplate} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Modal (Create or View Template) */}
            <ExpandedModal 
                isOpen={isExpanded}
                animationClass={animationClass}
                onClose={closeExpanded}
            >
                {isCreating ? (
                    <TemplateForm 
                        template={template} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                        message={message} 
                    />
                ) : (
                    <TemplateSummary template={selectedTemplate} />
                )}
            </ExpandedModal>

            <Footer />
        </>
    );
}