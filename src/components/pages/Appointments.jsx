import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import AppointmentForm from "@/components/organisms/AppointmentForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { AppointmentService } from "@/services/api/AppointmentService";
import { PatientService } from "@/services/api/PatientService";
import { DoctorService } from "@/services/api/DoctorService";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Appointments = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState(null);
  const [preselectedTime, setPreselectedTime] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll(),
        DoctorService.getAll()
      ]);

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load appointments data. Please try again.");
      console.error("Appointments data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
if (id && appointments.length > 0) {
      const appointment = appointments.find(apt => apt.Id === parseInt(id));
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowDetails(true);
      }
    }
  }, [id, appointments]);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setShowForm(true);
    }
  }, [location.state]);

  const handleBookAppointment = (date, timeSlot) => {
    setPreselectedDate(date);
    setPreselectedTime(timeSlot);
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
    navigate(`/appointments/${appointment.Id}`);
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      setFormLoading(true);
      const newAppointment = await AppointmentService.create(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      setShowForm(false);
      setPreselectedDate(null);
      setPreselectedTime(null);
      toast.success("Appointment booked successfully!");
    } catch (err) {
      toast.error("Failed to book appointment. Please try again.");
      console.error("Appointment creation error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      setFormLoading(true);
      const updatedAppointment = await AppointmentService.update(selectedAppointment.Id, appointmentData);
      setAppointments(prev => prev.map(apt => apt.Id === selectedAppointment.Id ? updatedAppointment : apt));
      setSelectedAppointment(updatedAppointment);
      setShowForm(false);
      toast.success("Appointment updated successfully!");
    } catch (err) {
      toast.error("Failed to update appointment. Please try again.");
      console.error("Appointment update error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await AppointmentService.delete(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.Id !== appointmentId));
      if (selectedAppointment && selectedAppointment.Id === appointmentId) {
        setShowDetails(false);
        setSelectedAppointment(null);
      }
      toast.success("Appointment cancelled successfully!");
    } catch (err) {
      toast.error("Failed to cancel appointment. Please try again.");
      console.error("Appointment deletion error:", err);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
    navigate("/appointments");
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = appointments.filter(apt => {
      const aptDate = new Date(apt.date_c || apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    }).length;

    const pendingCount = appointments.filter(apt => apt.status === "pending").length;
    const confirmedCount = appointments.filter(apt => apt.status === "confirmed").length;

    return { todayCount, pendingCount, confirmedCount };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getAppointmentStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Appointment Management"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={(query) => console.log("Search appointments:", query)}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Button
                  variant="primary"
                  icon="Plus"
                  onClick={() => handleBookAppointment(new Date(), "09:00")}
                  className="w-full shadow-lg"
                >
                  Book New Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Schedule Overview</h2>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "calendar" ? "primary" : "ghost"}
                size="sm"
                icon="Calendar"
                onClick={() => setViewMode("calendar")}
                className="text-xs"
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                icon="List"
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" ? (
          appointments.length > 0 ? (
            <AppointmentCalendar
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              onBookAppointment={handleBookAppointment}
              onViewAppointment={handleViewAppointment}
            />
          ) : (
            <Empty
              title="No appointments scheduled"
              description="Start by booking your first appointment to manage patient care schedules."
              icon="Calendar"
              actionLabel="Book First Appointment"
              onAction={() => handleBookAppointment(new Date(), "09:00")}
            />
          )
        ) : (
          /* List View */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="List" className="w-5 h-5 mr-2 text-primary" />
                All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments
                    .sort((a, b) => new Date(a.date + " " + a.timeSlot) - new Date(b.date + " " + b.timeSlot))
                    .map((apt) => {
                      const patient = patients.find(p => p.Id === parseInt(apt.patientId));
                      const doctor = doctors.find(d => d.Id === parseInt(apt.doctorId));
                      
                      return (
                        <div
                          key={apt.Id}
                          onClick={() => handleViewAppointment(apt)}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-surface"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {format(parseISO(apt.date), "MMM dd, yyyy")} at {apt.timeSlot}
                              </div>
                              <div className="text-sm text-gray-600">
                                Dr. {doctor?.name || "Unknown"} • {apt.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getStatusColor(apt.status)}>
                              {apt.status}
                            </Badge>
                            <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <Empty
                  title="No appointments scheduled"
                  description="Start by booking your first appointment to manage patient care schedules."
                  icon="Calendar"
                  actionLabel="Book First Appointment"
                  onAction={() => handleBookAppointment(new Date(), "09:00")}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Appointment Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedAppointment(null);
            setPreselectedDate(null);
            setPreselectedTime(null);
          }}
          title={selectedAppointment ? "Edit Appointment" : "Book New Appointment"}
          size="lg"
        >
          <AppointmentForm
            appointment={selectedAppointment}
            patients={patients}
            doctors={doctors}
            onSubmit={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
            onCancel={() => {
              setShowForm(false);
              setSelectedAppointment(null);
              setPreselectedDate(null);
              setPreselectedTime(null);
            }}
            isLoading={formLoading}
            preselectedDate={preselectedDate}
            preselectedTime={preselectedTime}
          />
        </Modal>

        {/* Appointment Details Modal */}
        <Modal
          isOpen={showDetails}
          onClose={closeDetails}
          title="Appointment Details"
          size="lg"
        >
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Appointment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    <ApperIcon name="Calendar" className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
{selectedAppointment.type_c || selectedAppointment.type}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {format(parseISO(selectedAppointment.date_c || selectedAppointment.date), "EEEE, MMMM dd, yyyy")} at {selectedAppointment.time_slot_c || selectedAppointment.timeSlot}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getStatusColor(selectedAppointment.status_c || selectedAppointment.status)} className="text-sm">
                        {selectedAppointment.status_c || selectedAppointment.status}
                      </Badge>
                      <Badge variant="info" className="text-sm">
                        {selectedAppointment.duration_c || selectedAppointment.duration} min
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    icon="Edit"
                    onClick={() => {
                      setShowDetails(false);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    icon="Trash2"
                    onClick={() => handleDeleteAppointment(selectedAppointment.Id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Appointment Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="User" className="w-4 h-4 mr-2 text-primary" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
const patient = patients.find(p => p.Id === parseInt(selectedAppointment.patientId));
                      return patient ? (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                            <p className="text-sm font-medium text-gray-900">
                              {patient.first_name_c} {patient.last_name_c}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                            <p className="text-sm font-medium text-gray-900">{patient.phone_c}</p>
                            <p className="text-sm text-gray-600">{patient.email_c}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age & Blood Type</label>
                            <p className="text-sm font-medium text-gray-900">
                              {patient.date_of_birth_c ? new Date().getFullYear() - new Date(patient.date_of_birth_c).getFullYear() : 0} years • {patient.blood_type_c}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Patient information not available</p>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Doctor Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="UserCheck" className="w-4 h-4 mr-2 text-secondary" />
                      Doctor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
const doctor = doctors.find(d => d.Id === parseInt(selectedAppointment.doctorId));
                      return doctor ? (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Doctor</label>
                            <p className="text-sm font-medium text-gray-900">Dr. {doctor.name_c || doctor.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Specialization</label>
                            <p className="text-sm font-medium text-gray-900">{doctor.specialization_c || doctor.specialization}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                            <p className="text-sm font-medium text-gray-900">{doctor.phone_c || doctor.phone}</p>
                            <p className="text-sm text-gray-600">{doctor.email_c || doctor.email}</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Doctor information not available</p>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Notes */}
{(selectedAppointment.notes_c || selectedAppointment.notes) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedAppointment.notes_c || selectedAppointment.notes}</p>
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="FileText" className="w-4 h-4 mr-2 text-warning" />
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="ghost" onClick={closeDetails}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  icon="FileText"
                  onClick={() => {
                    closeDetails();
                    navigate("/records", { state: { selectedAppointmentId: selectedAppointment.Id } });
                  }}
                >
                  View Medical Records
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;