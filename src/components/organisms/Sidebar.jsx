import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Patients", href: "/patients", icon: "Users" },
    { name: "Appointments", href: "/appointments", icon: "Calendar" },
    { name: "Doctors", href: "/doctors", icon: "UserCheck" },
    { name: "Medical Records", href: "/records", icon: "FileText" }
  ];

  const NavItem = ({ item, mobile = false }) => {
    const isActive = location.pathname === item.href || 
                    (item.href !== "/" && location.pathname.startsWith(item.href));

    return (
      <NavLink
        to={item.href}
        onClick={mobile ? onClose : undefined}
        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary to-primary-700 text-white shadow-lg"
            : "text-gray-600 hover:bg-gradient-to-r hover:from-surface hover:to-gray-100 hover:text-gray-900"
        }`}
      >
        <ApperIcon 
          name={item.icon} 
          className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
            isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
          }`} 
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Heart" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
                MediFlow
              </h1>
              <p className="text-xs text-gray-500">Hospital Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        
        <div className="flex-shrink-0 p-4">
          <div className="bg-gradient-to-r from-surface to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-green-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">System Online</p>
                <p className="text-xs text-gray-500">All services running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative flex flex-col max-w-xs w-full bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Heart" className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
                    MediFlow
                  </h1>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} mobile />
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;