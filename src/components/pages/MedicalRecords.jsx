import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { MedicalRecordService } from "@/services/api/MedicalRecordService";
import { PatientService } from "@/services/api/PatientService";
import { DoctorService } from "@/services/api/DoctorService";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Doctors from "@/components/pages/Doctors";
import Patients from "@/components/pages/Patients";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const MedicalRecords = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [recordsData, patientsData, doctorsData] = await Promise.all([
        MedicalRecordService.getAll(),
        PatientService.getAll(),
        DoctorService.getAll()
      ]);

      setRecords(recordsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setFilteredRecords(recordsData);
    } catch (err) {
      setError("Failed to load medical records. Please try again.");
      console.error("Medical records loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.selectedAppointmentId) {
      // Filter records related to specific appointment if navigated from appointments
      toast.info("Showing records related to selected appointment");
    }
  }, [location.state]);

  const handleSearch = (query) => {
    let filtered = records;

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(record => {
        const patient = patients.find(p => p.Id === parseInt(record.patientId));
const doctor = doctors.find(d => d.Id === parseInt(record.doctorId));
        return (
          record.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
          record.notes.toLowerCase().includes(query.toLowerCase()) ||
          (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query.toLowerCase())) ||
          (doctor && doctor.name.toLowerCase().includes(query.toLowerCase()))
        );
      });
    }

    // Filter by selected patient
    if (selectedPatient) {
      filtered = filtered.filter(record => 
        parseInt(record.patientId) === parseInt(selectedPatient)
      );
    }

    // Filter by selected doctor
    if (selectedDoctor) {
      filtered = filtered.filter(record => 
        parseInt(record.doctorId) === parseInt(selectedDoctor)
      );
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.visitDate);
        return recordDate >= new Date(dateRange.start) && recordDate <= new Date(dateRange.end);
      });
    }

    setFilteredRecords(filtered);
  };

  useEffect(() => {
    handleSearch("");
  }, [selectedPatient, selectedDoctor, dateRange, records, patients, doctors]);

  const getRecordStats = () => {
    const totalRecords = records.length;
    const thisMonth = records.filter(record => {
      const recordDate = new Date(record.visitDate);
      const now = new Date();
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }).length;
    
    const uniquePatients = new Set(records.map(record => record.patientId)).size;
    const uniqueDoctors = new Set(records.map(record => record.doctorId)).size;

    return { totalRecords, thisMonth, uniquePatients, uniqueDoctors };
  };

  const getDiagnosisColor = (diagnosis) => {
    // Simple color coding based on severity/type keywords
    const lower = diagnosis.toLowerCase();
    if (lower.includes("emergency") || lower.includes("urgent") || lower.includes("critical")) {
      return "error";
    } else if (lower.includes("follow-up") || lower.includes("routine") || lower.includes("check-up")) {
      return "accent";
    } else if (lower.includes("consultation") || lower.includes("examination")) {
      return "primary";
    }
    return "secondary";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getRecordStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header
        title="Medical Records"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="FileText" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="Users" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniquePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                  <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueDoctors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Filter" className="w-5 h-5 mr-2 text-info" />
              Filter Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
                >
                  <option value="">All Patients</option>
                  {patients.map((patient) => (
<option key={patient.Id} value={patient.Id}>
                      {patient.first_name_c} {patient.last_name_c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all duration-200"
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doctor) => (
<option key={doctor.Id} value={doctor.Id}>
                      Dr. {doctor.name_c || doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                icon="X"
                onClick={() => {
                  setSelectedPatient("");
                  setSelectedDoctor("");
                  setDateRange({ start: "", end: "" });
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-primary" />
                Medical Records ({filteredRecords.length})
              </CardTitle>
              <Button
                variant="primary"
                icon="Plus"
                onClick={() => toast.info("Add new medical record feature coming soon!")}
              >
                Add Record
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredRecords
                  .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
                  .map((record) => {
                    const patient = patients.find(p => p.Id === parseInt(record.patientId));
                    const doctor = doctors.find(d => d.Id === parseInt(record.doctorId));
                    
                    return (
                      <div
                        key={record.Id}
                        className="p-6 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-gradient-to-r from-white to-surface"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                              <ApperIcon name="FileText" className="w-6 h-6 text-white" />
                            </div>
<div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {patient ? `${patient.first_name_c} ${patient.last_name_c}` : "Unknown Patient"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Visit Date: {format(parseISO(record.visit_date_c || record.visitDate), "MMMM dd, yyyy")}
                              </p>
                              <p className="text-sm text-gray-600">
                                Doctor: Dr. {doctor?.name_c || doctor?.name || "Unknown"}
                              </p>
                            </div>
                          </div>
<Badge variant={getDiagnosisColor(record.diagnosis_c || record.diagnosis)}>
                            {(record.diagnosis_c || record.diagnosis).slice(0, 30)}{(record.diagnosis_c || record.diagnosis).length > 30 ? "..." : ""}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Diagnosis */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <ApperIcon name="Activity" className="w-4 h-4 mr-2 text-secondary" />
                              Diagnosis
                            </h4>
<p className="text-sm text-gray-700">{record.diagnosis_c || record.diagnosis}</p>
                          </div>

                          {/* Vital Signs */}
                          {record.vitalSigns && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <ApperIcon name="Heart" className="w-4 h-4 mr-2 text-error" />
                                Vital Signs
                              </h4>
<div className="grid grid-cols-2 gap-2 text-sm">
                                {(record.vitalSigns?.bloodPressure || record.vital_signs_blood_pressure_c) && (
                                  <div>
                                    <span className="text-gray-500">BP:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns?.bloodPressure || record.vital_signs_blood_pressure_c}</span>
                                  </div>
                                )}
                                {(record.vitalSigns?.temperature || record.vital_signs_temperature_c) && (
                                  <div>
                                    <span className="text-gray-500">Temp:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns?.temperature || record.vital_signs_temperature_c}°F</span>
                                  </div>
                                )}
                                {(record.vitalSigns?.heartRate || record.vital_signs_heart_rate_c) && (
                                  <div>
                                    <span className="text-gray-500">HR:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns?.heartRate || record.vital_signs_heart_rate_c} bpm</span>
                                  </div>
                                )}
                                {(record.vitalSigns?.weight || record.vital_signs_weight_c) && (
                                  <div>
                                    <span className="text-gray-500">Weight:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns?.weight || record.vital_signs_weight_c} lbs</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Prescription */}
{(record.prescription_c || (record.prescription && record.prescription.length > 0)) && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <ApperIcon name="Pill" className="w-4 h-4 mr-2 text-accent" />
                                Prescription
                              </h4>
                              <div className="space-y-1">
                                {(record.prescription || []).map((med, index) => (
                                  <div key={index} className="flex items-center text-sm">
                                    <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                                    <span className="font-medium">{med.medication}</span>
                                    <span className="text-gray-500 ml-2">- {med.dosage}</span>
                                  </div>
                                ))}
                                {record.prescription_c && typeof record.prescription_c === 'string' && (
                                  <div className="text-sm text-gray-700">{record.prescription_c}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
{/* Notes */}
                          {(record.notes_c || record.notes) && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <ApperIcon name="FileText" className="w-4 h-4 mr-2 text-info" />
                                Notes
                              </h4>
                              <p className="text-sm text-gray-700">{record.notes_c || record.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Eye"
                            onClick={() => toast.info("View full record feature coming soon!")}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Printer"
                            onClick={() => toast.info("Print record feature coming soon!")}
                          >
                            Print
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Edit"
                            onClick={() => toast.info("Edit record feature coming soon!")}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <Empty
                title="No medical records found"
                description={records.length === 0 
                  ? "Medical records will appear here as patients visit and receive care."
                  : "No records match your current filter criteria. Try adjusting your search terms or filters."
                }
                icon="FileText"
                actionLabel="Add Medical Record"
                onAction={() => toast.info("Add medical record feature coming soon!")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecords;