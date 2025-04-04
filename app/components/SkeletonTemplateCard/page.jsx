// components/SkeletonTemplateCard.jsx
import React from "react";

const SkeletonTemplateCard = () => (
  <div className="w-[23.7%] h-[50%] bg-gray-200 rounded-2xl flex flex-col p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-5"></div>
    <div className="h-4 bg-gray-300 rounded-md w-full mb-3"></div>
    <div className="h-4 bg-gray-300 rounded-md w-2/3 mt-3"></div>
    <div className="h-4 bg-gray-300 rounded-md w-1/2 mt-2"></div>
    <div className="h-4 bg-gray-300 rounded-md w-4/5 mt-2"></div>
  </div>
);

export default SkeletonTemplateCard;