import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, showSearch = false, onSearch }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden mr-3"
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search patients, appointments..."
                className="w-80"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-error to-red-600 rounded-full"></span>
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search patients, appointments..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;