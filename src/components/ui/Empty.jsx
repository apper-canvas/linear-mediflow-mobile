import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.", 
  actionLabel,
  onAction,
  icon = "Search"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-surface to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        Start by creating your first entry to get organized.
      </div>
    </div>
  );
};

export default Empty;