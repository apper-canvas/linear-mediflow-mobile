import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import DoctorSchedule from "@/components/organisms/DoctorSchedule";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { DoctorService } from "@/services/api/DoctorService";
import { AppointmentService } from "@/services/api/AppointmentService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [doctorsData, appointmentsData] = await Promise.all([
        DoctorService.getAll(),
        AppointmentService.getAll()
      ]);

      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setFilteredDoctors(doctorsData);
      
      if (doctorsData.length > 0) {
        setSelectedDoctor(doctorsData[0]);
      }
    } catch (err) {
      setError("Failed to load doctors data. Please try again.");
      console.error("Doctors data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (id && doctors.length > 0) {
      const doctor = doctors.find(d => d.Id === parseInt(id));
      if (doctor) {
        setSelectedDoctor(doctor);
        setViewMode("schedule");
      }
    }
  }, [id, doctors]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
      doctor.email.toLowerCase().includes(query.toLowerCase()) ||
      doctor.phone.includes(query)
    );
    setFilteredDoctors(filtered);
  };

  const getDoctorAppointments = (doctorId) => {
    return appointments.filter(apt => parseInt(apt.doctorId) === doctorId);
  };

  const getDoctorStats = (doctorId) => {
    const doctorAppts = getDoctorAppointments(doctorId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppts = doctorAppts.filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });

    const thisWeek = doctorAppts.filter(apt => {
      const aptDate = new Date(apt.date);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });

    return {
      total: doctorAppts.length,
      today: todayAppts.length,
      thisWeek: thisWeek.length
    };
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      "Cardiology": "error",
      "Neurology": "secondary",
      "Pediatrics": "accent",
      "Orthopedics": "info",
      "Dermatology": "warning",
      "General Practice": "primary"
    };
    return colors[specialization] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Doctor Management"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Doctor Overview ({filteredDoctors.length})
            </h2>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                icon="Users"
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                List
              </Button>
              <Button
                variant={viewMode === "schedule" ? "primary" : "ghost"}
                size="sm"
                icon="Calendar"
                onClick={() => setViewMode("schedule")}
                className="text-xs"
              >
                Schedule
              </Button>
            </div>
          </div>
          <Button
            variant="secondary"
            icon="UserPlus"
            onClick={() => toast.info("Doctor registration feature coming soon!")}
            className="shadow-lg"
          >
            Add Doctor
          </Button>
        </div>

        {viewMode === "list" ? (
          /* Doctors List View */
          filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => {
                const stats = getDoctorStats(doctor.Id);
                
                return (
                  <Card key={doctor.Id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-700 rounded-full flex items-center justify-center shadow-lg">
                            <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {doctor.name}
                            </h3>
                            <Badge variant={getSpecializationColor(doctor.specialization)} className="text-xs">
                              {doctor.specialization}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                          {doctor.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                          {doctor.appointmentDuration} min slots
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Award" className="w-4 h-4 mr-2" />
                          License: {doctor.license}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">{stats.today}</div>
                            <div className="text-xs text-gray-500">Today</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">{stats.thisWeek}</div>
                            <div className="text-xs text-gray-500">This Week</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon="Calendar"
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setViewMode("schedule");
                              navigate(`/doctors/${doctor.Id}`);
                            }}
                            className="flex-1"
                          >
                            View Schedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Edit"
                            onClick={() => toast.info("Doctor edit feature coming soon!")}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Empty
              title="No doctors found"
              description={doctors.length === 0 
                ? "Start by adding doctors to manage their schedules and appointments."
                : "No doctors match your search criteria. Try adjusting your search terms."
              }
              icon="UserCheck"
              actionLabel="Add First Doctor"
              onAction={() => toast.info("Doctor registration feature coming soon!")}
            />
          )
        ) : (
          /* Schedule View */
          selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Selection for Schedule View */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
                      Doctor Schedule Management
                    </CardTitle>
                    <Button
                      variant="ghost"
                      icon="ArrowLeft"
                      onClick={() => {
                        setViewMode("list");
                        navigate("/doctors");
                      }}
                    >
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <DoctorSchedule
                doctors={doctors}
                appointments={appointments}
                selectedDoctorId={selectedDoctor.Id}
                onScheduleUpdate={(schedule) => {
                  toast.success("Schedule updated successfully!");
                }}
              />
            </div>
          )
        )}

        {/* Overall Statistics */}
        {viewMode === "list" && doctors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-info" />
                Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <ApperIcon name="Users" className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctors.length}</div>
                  <div className="text-sm text-gray-600">Active Doctors</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {doctors.reduce((total, doctor) => total + getDoctorStats(doctor.Id).total, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Appointments</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-700 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <ApperIcon name="Activity" className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Set(doctors.map(d => d.specialization)).size}
                  </div>
                  <div className="text-sm text-gray-600">Specializations</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(doctors.reduce((total, doctor) => total + doctor.appointmentDuration, 0) / doctors.length)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Slot Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Doctors;