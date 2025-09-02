import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Patients from "@/components/pages/Patients";
import Appointments from "@/components/pages/Appointments";
import Doctors from "@/components/pages/Doctors";
import MedicalRecords from "@/components/pages/MedicalRecords";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className="flex-1 lg:ml-64 transition-all duration-300">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/patients" 
              element={<Patients onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/patients/:id" 
              element={<Patients onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/appointments" 
              element={<Appointments onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/appointments/:id" 
              element={<Appointments onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/doctors" 
              element={<Doctors onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/doctors/:id" 
              element={<Doctors onMenuClick={handleMenuClick} />} 
            />
            <Route 
              path="/records" 
              element={<MedicalRecords onMenuClick={handleMenuClick} />} 
            />
          </Routes>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;