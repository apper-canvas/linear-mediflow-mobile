import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong. Please try again.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 max-w-md mb-6">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-700 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        If the problem persists, please contact support.
      </div>
    </div>
  );
};

export default Error;