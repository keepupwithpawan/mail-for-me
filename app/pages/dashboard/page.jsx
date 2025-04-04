"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../components/navbar/page";
import Footer from "../../components/footer/page";
import { CirclePlus, X, Mail } from "lucide-react";

export default function Dashboard() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState("");
    const [template, setTemplate] = useState({ title: "", subject: "", content: "" });
    const [templatesList, setTemplatesList] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [animationClass, setAnimationClass] = useState(""); // For controlling animation classes
    const [clickPosition, setClickPosition] = useState(null); // Store click position for animation

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true); // Set loading to true when fetch starts
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
            setIsLoading(false); // Set loading to false when fetch completes (success or error)
        }
    };

    const handleChange = (e) => {
        setTemplate({ ...template, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Submitting...");

        // ✅ Corrected object structure while inserting into Supabase
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
            // ✅ Corrected state reset
            setTemplate({ title: "", subject: "", content: "" });
            setIsExpanded(false); // ✅ Close modal on success
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

    const truncateText = (text, wordLimit = 20) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };
    
    const truncateTextLarger = (text, wordLimit = 50) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    // Skeleton loader components
    const SkeletonTemplateCard = () => (
        <div className="w-[23.7%] h-[50%] bg-gray-200 rounded-2xl flex flex-col p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-5"></div>
            <div className="h-4 bg-gray-300 rounded-md w-full mb-3"></div>
            <div className="h-4 bg-gray-300 rounded-md w-2/3 mt-3"></div>
            <div className="h-4 bg-gray-300 rounded-md w-1/2 mt-2"></div>
            <div className="h-4 bg-gray-300 rounded-md w-4/5 mt-2"></div>
        </div>
    );

    return (
        <>
            <Navbar />

            {/* Add CSS for animations */}
            <style jsx global>{`
                @keyframes expandBackground {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes collapseBackground {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes expandMenu {
                    from {
                        opacity: 0;
                        transform: scale(0.7);
                        ${clickPosition ? `transform-origin: ${clickPosition.x}px ${clickPosition.y}px;` : ''}
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                        transform-origin: center center;
                    }
                }
                
                @keyframes collapseMenu {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.7);
                        ${clickPosition ? `transform-origin: ${clickPosition.x}px ${clickPosition.y}px;` : ''}
                    }
                }
                
                .expanded-background.animate-expand {
                    animation: expandBackground 0.3s ease forwards;
                }
                
                .expanded-background.animate-collapse {
                    animation: collapseBackground 0.3s ease forwards;
                }
                
                .expanded-modal.animate-expand {
                    animation: expandMenu 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                
                .expanded-modal.animate-collapse {
                    animation: collapseMenu 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
                }
            `}</style>

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
                                    <div
                                        key={item.id}
                                        className="template-item w-[23.7%] h-[50%] bg-gray-200 text-foreground dark:text-background rounded-2xl flex flex-col p-6 cursor-pointer transition hover:bg-gray-300"
                                        onClick={(e) => openTemplate(item, e)}
                                    >
                                        <h3 className="text-xl font-semibold mb-5">{truncateText(item.title)}</h3>
                                        <p className="text-l">{truncateText(item.subject)}</p>
                                        <p className="text-sm mt-3">{truncateText(item.content)}</p>
                                    </div>
                                ))}

                                {/* Create Template Button */}
                                <div
                                    className="template-create w-[23.7%] h-[50%] bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer transition hover:bg-gray-300"
                                    onClick={(e) => openCreateTemplate(e)}
                                >
                                    <CirclePlus className="w-10 h-10" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Menu (Create or View Template) */}
            {isExpanded && (
                <div className={`expanded-background fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 ${animationClass}`}>
                    <div className={`expanded-modal bg-background px-7 py-6 rounded-2xl w-[70%] h-[72%] shadow-lg relative flex flex-col ${animationClass}`}>
                        {/* Close Button */}
                        <button className="absolute top-3 right-3 text-foreground cursor-pointer" onClick={closeExpanded}>
                            <X size={24} />
                        </button>

                        {/* Show Create Form or Template Summary */}
                        {isCreating ? (
                            // Show Create Template Form
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
                                        <button className="px-4 py-3 rounded-lg bg-foreground text-background hover:bg-accent hover:text-white cursor-pointer" onClick={handleSubmit}>
                                            Save Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Show Template Summary
                            <>
                                {/* Top Section - Summary Box */}
                                <div className="rounded-lg p-6 w-full mt-4 mb-10">
                                    <h2 className="text-3xl font-semibold mb-4">Template Summary</h2>
                                    <h3 className="text-xl font-semibold">Title:</h3>
                                    <p className="mb-3">{selectedTemplate?.title}</p>

                                    <h3 className="text-xl font-semibold">Subject:</h3>
                                    <p className="mb-3">{selectedTemplate?.subject}</p>

                                    <h3 className="text-xl font-semibold">Content:</h3>
                                    <p className="mb-3">{truncateTextLarger(selectedTemplate?.content)}</p>
                                </div>

                                {/* Bottom Section - Email Button */}
                                <div className="flex flex-col items-center justify-center">
                                    <button
                                        className="px-5 py-3 bg-foreground text-background hover:bg-accent hover:text-white rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                                        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(selectedTemplate?.subject)}&body=${encodeURIComponent(selectedTemplate?.content)}`)}
                                    >
                                       <img src="https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000" alt="" className="w-8" /> Send via Gmail
                                    </button>
                                    <p className="secondary-text mt-4 text-sm text-center">
                                        (Email will be sent via the Google Account signed in on this browser)
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}