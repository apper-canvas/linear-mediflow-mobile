import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import PatientTable from "@/components/organisms/PatientTable";
import PatientForm from "@/components/organisms/PatientForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { PatientService } from "@/services/api/PatientService";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

const Patients = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await PatientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
      console.error("Patients loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (id && patients.length > 0) {
      const patient = patients.find(p => p.Id === parseInt(id));
      if (patient) {
        setSelectedPatient(patient);
        setShowDetails(true);
      }
    }
  }, [id, patients]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query) ||
      patient.id?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleCreatePatient = async (patientData) => {
    try {
      setFormLoading(true);
      const newPatient = await PatientService.create(patientData);
      setPatients(prev => [...prev, newPatient]);
      setFilteredPatients(prev => [...prev, newPatient]);
      setShowForm(false);
      toast.success("Patient registered successfully!");
    } catch (err) {
      toast.error("Failed to register patient. Please try again.");
      console.error("Patient creation error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePatient = async (patientData) => {
    try {
      setFormLoading(true);
      const updatedPatient = await PatientService.update(selectedPatient.Id, patientData);
      setPatients(prev => prev.map(p => p.Id === selectedPatient.Id ? updatedPatient : p));
      setFilteredPatients(prev => prev.map(p => p.Id === selectedPatient.Id ? updatedPatient : p));
      setSelectedPatient(updatedPatient);
      setShowForm(false);
      toast.success("Patient updated successfully!");
    } catch (err) {
      toast.error("Failed to update patient. Please try again.");
      console.error("Patient update error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return;
    }

    try {
      await PatientService.delete(patientId);
      setPatients(prev => prev.filter(p => p.Id !== patientId));
      setFilteredPatients(prev => prev.filter(p => p.Id !== patientId));
      if (selectedPatient && selectedPatient.Id === patientId) {
        setShowDetails(false);
        setSelectedPatient(null);
      }
      toast.success("Patient deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete patient. Please try again.");
      console.error("Patient deletion error:", err);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
    navigate(`/patients/${patient.Id}`);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowForm(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedPatient(null);
    navigate("/patients");
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "A+": "error", "A-": "error",
      "B+": "info", "B-": "info", 
      "AB+": "secondary", "AB-": "secondary",
      "O+": "accent", "O-": "accent"
    };
    return colors[bloodType] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Patient Management"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Patients ({filteredPatients.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage patient records and information
            </p>
          </div>
          <Button
            variant="primary"
            icon="UserPlus"
            onClick={() => setShowForm(true)}
            className="shadow-lg"
          >
            Register Patient
          </Button>
        </div>

        {/* Patients Table */}
        {filteredPatients.length > 0 ? (
          <PatientTable
            patients={filteredPatients}
            onViewPatient={handleViewPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        ) : (
          <Empty
            title="No patients found"
            description={patients.length === 0 
              ? "Start by registering your first patient to begin managing medical records."
              : "No patients match your search criteria. Try adjusting your search terms."
            }
            icon="Users"
            actionLabel="Register First Patient"
            onAction={() => setShowForm(true)}
          />
        )}

        {/* Patient Registration/Edit Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedPatient(null);
          }}
          title={selectedPatient ? "Edit Patient" : "Register New Patient"}
          size="xl"
        >
          <PatientForm
            patient={selectedPatient}
            onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
            onCancel={() => {
              setShowForm(false);
              setSelectedPatient(null);
            }}
            isLoading={formLoading}
          />
        </Modal>

        {/* Patient Details Modal */}
        <Modal
          isOpen={showDetails}
          onClose={closeDetails}
          title="Patient Details"
          size="lg"
        >
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Patient ID: {selectedPatient.id}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getBloodTypeColor(selectedPatient.bloodType)}>
                        {selectedPatient.bloodType}
                      </Badge>
                      <Badge variant="primary">
                        {selectedPatient.gender}
                      </Badge>
                    </div>
                  </div>
                </div>
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
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="User" className="w-4 h-4 mr-2 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</label>
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(selectedPatient.dateOfBirth), "MMMM dd, yyyy")}
                        <span className="text-gray-500 ml-2">
                          ({new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years old)
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration Date</label>
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(selectedPatient.registrationDate), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-secondary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                      <p className="text-sm font-medium text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-sm font-medium text-gray-900">{selectedPatient.email}</p>
                    </div>
                    {selectedPatient.address && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                        <p className="text-sm font-medium text-gray-900">{selectedPatient.address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                {selectedPatient.emergencyContact && selectedPatient.emergencyContact.name && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <ApperIcon name="UserPlus" className="w-4 h-4 mr-2 text-accent" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                        <p className="text-sm font-medium text-gray-900">{selectedPatient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Relationship</label>
                        <p className="text-sm font-medium text-gray-900">{selectedPatient.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                        <p className="text-sm font-medium text-gray-900">{selectedPatient.emergencyContact.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Medical Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <ApperIcon name="Heart" className="w-4 h-4 mr-2 text-error" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Blood Type</label>
                      <div className="mt-1">
                        <Badge variant={getBloodTypeColor(selectedPatient.bloodType)} className="text-sm">
                          {selectedPatient.bloodType}
                        </Badge>
                      </div>
                    </div>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Allergies</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPatient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="warning" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={closeDetails}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  icon="Calendar"
                  onClick={() => {
                    closeDetails();
                    navigate("/appointments", { state: { selectedPatientId: selectedPatient.Id } });
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Patients;