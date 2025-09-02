import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { PatientService } from "@/services/api/PatientService";
import { AppointmentService } from "@/services/api/AppointmentService";
import { DoctorService } from "@/services/api/DoctorService";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientsData, appointmentsData, doctorsData] = await Promise.all([
        PatientService.getAll(),
        AppointmentService.getAll(),
        DoctorService.getAll()
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getTodayAppointments = () => {
return appointments.filter(apt => 
      isToday(parseISO(apt.date_c || apt.date))
    );
  };

const getUpcomingAppointments = () => {
    return appointments
      .filter(apt => {
        const aptDate = parseISO(apt.date_c || apt.date);
        const today = new Date();
        const sevenDaysFromNow = addDays(today, 7);
        return aptDate >= today && aptDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

const getRecentPatients = () => {
    return patients
      .sort((a, b) => new Date(b.registration_date_c || b.registrationDate) - new Date(a.registration_date_c || a.registrationDate))
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
      .slice(0, 5);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "accent",
      pending: "warning",
      cancelled: "error",
      completed: "primary"
    };
    return colors[status] || "default";
  };

const getAppointmentStats = () => {
    const today = getTodayAppointments();
    const confirmed = appointments.filter(apt => (apt.status_c || apt.status) === "confirmed").length;
    const pending = appointments.filter(apt => (apt.status_c || apt.status) === "pending").length;
    const completed = appointments.filter(apt => (apt.status_c || apt.status) === "completed").length;

    return { today: today.length, confirmed, pending, completed };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = getAppointmentStats();
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const recentPatients = getRecentPatients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Dashboard"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={(query) => console.log("Search:", query)}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={patients.length}
            change="+12%"
            trend="up"
            icon="Users"
            color="primary"
          />
          <StatCard
            title="Today's Appointments"
            value={stats.today}
            change={`${stats.confirmed} confirmed`}
            trend="up"
            icon="Calendar"
            color="accent"
          />
          <StatCard
            title="Pending Appointments"
            value={stats.pending}
            change="Needs attention"
            trend="up"
            icon="Clock"
            color="warning"
          />
          <StatCard
            title="Active Doctors"
            value={doctors.length}
            change="All available"
            trend="up"
            icon="UserCheck"
            color="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
                  Today's Appointments
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={() => navigate("/appointments")}
                >
                  Book New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
{todayAppointments
                    .sort((a, b) => (a.time_slot_c || a.timeSlot).localeCompare(b.time_slot_c || b.timeSlot))
                    .map((apt) => {
                      const patient = patients.find(p => p.Id === parseInt(apt.patientId));
                      const doctor = doctors.find(d => d.Id === parseInt(apt.doctorId));
                      
                      return (
                        <div
                          key={apt.Id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-gradient-to-r from-white to-surface"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
{apt.time_slot_c || apt.timeSlot} - {patient ? `${patient.first_name_c} ${patient.last_name_c}` : "Unknown Patient"}
                              </div>
                              <div className="text-sm text-gray-600">
                                Dr. {doctor?.name_c || doctor?.name || "Unknown"} • {apt.type_c || apt.type}
                              </div>
                              {apt.notes && (
                                <div className="text-xs text-gray-500 mt-1">{apt.notes}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
<Badge variant={getStatusColor(apt.status_c || apt.status)}>
                              {apt.status_c || apt.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Eye"
                              onClick={() => navigate(`/appointments/${apt.Id}`)}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <Empty
                  title="No appointments today"
                  description="Your schedule is clear for today."
                  icon="Calendar"
                  actionLabel="Book Appointment"
                  onAction={() => navigate("/appointments")}
                />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  icon="UserPlus"
                  onClick={() => navigate("/patients/new")}
                >
                  Register New Patient
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  icon="Calendar"
                  onClick={() => navigate("/appointments")}
                >
                  Schedule Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon="FileText"
                  onClick={() => navigate("/records")}
                >
                  View Medical Records
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  icon="Users"
                  onClick={() => navigate("/doctors")}
                >
                  Manage Doctors
                </Button>
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="UserPlus" className="w-5 h-5 mr-2 text-secondary" />
                  Recent Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPatients.length > 0 ? (
                  <div className="space-y-3">
                    {recentPatients.map((patient) => (
                      <div
                        key={patient.Id}
                        onClick={() => navigate(`/patients/${patient.Id}`)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-surface hover:to-gray-100 transition-all duration-200 cursor-pointer"
                      >
<div className="w-8 h-8 bg-gradient-to-r from-secondary to-secondary-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-xs">
                            {patient.first_name_c?.charAt(0) || ""}{patient.last_name_c?.charAt(0) || ""}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(parseISO(patient.registrationDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="No patients yet"
                    description="Start by registering your first patient."
                    icon="Users"
                    actionLabel="Register Patient"
                    onAction={() => navigate("/patients/new")}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="CalendarDays" className="w-5 h-5 mr-2 text-warning" />
              Upcoming Appointments (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{upcomingAppointments.slice(0, 6).map((apt) => {
                  const patient = patients.find(p => p.Id === parseInt(apt.patientId));
                  const doctor = doctors.find(d => d.Id === parseInt(apt.doctorId));
                  const aptDate = parseISO(apt.date_c || apt.date);
                  
                  return (
                    <div
                      key={apt.Id}
                      onClick={() => navigate(`/appointments/${apt.Id}`)}
                      className="p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-surface"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-sm font-semibold text-primary">
                          {isToday(aptDate) ? "Today" : 
                           isTomorrow(aptDate) ? "Tomorrow" :
                           format(aptDate, "MMM dd")}
                        </div>
                        <Badge variant={getStatusColor(apt.status)} className="text-xs">
{apt.status_c || apt.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">
                          {patient ? `${patient.first_name_c} ${patient.last_name_c}` : "Unknown Patient"}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                            {apt.time_slot_c || apt.timeSlot}
                          </div>
                          <div className="flex items-center mt-1">
                            <ApperIcon name="UserCheck" className="w-3 h-3 mr-1" />
                            Dr. {doctor?.name_c || doctor?.name || "Unknown"}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{apt.type_c || apt.type}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty
                title="No upcoming appointments"
                description="No appointments scheduled for the next 7 days."
                icon="CalendarDays"
                actionLabel="Schedule Appointment"
                onAction={() => navigate("/appointments")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;