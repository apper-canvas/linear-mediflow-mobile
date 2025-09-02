import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format, addDays } from "date-fns";

const AppointmentForm = ({ 
  appointment, 
  patients, 
  doctors, 
  onSubmit, 
  onCancel, 
  isLoading,
  preselectedDate,
  preselectedTime 
}) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "", 
    date: preselectedDate ? format(preselectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    timeSlot: preselectedTime || "09:00",
    duration: 30,
    type: "",
    status: "pending",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const appointmentTypes = [
    "Consultation",
    "Follow-up", 
    "Physical Exam",
    "Vaccination",
    "Laboratory Test",
    "X-Ray",
    "Emergency",
    "Surgery Consultation"
  ];

  const timeSlots = Array.from({ length: 20 }, (_, index) => {
    const hour = Math.floor((8 + index * 0.5) % 24);
    const minute = (index % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        date: appointment.date?.split("T")[0] || format(new Date(), "yyyy-MM-dd")
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find(d => d.Id === parseInt(formData.doctorId));
      setSelectedDoctor(doctor);
      if (doctor) {
        setFormData(prev => ({ ...prev, duration: doctor.appointmentDuration }));
      }
    }
  }, [formData.doctorId, doctors]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) newErrors.patientId = "Please select a patient";
    if (!formData.doctorId) newErrors.doctorId = "Please select a doctor";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";
    if (!formData.type) newErrors.type = "Appointment type is required";

    // Validate future date
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = "Appointment date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        duration: parseInt(formData.duration)
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getPatientDisplay = (patient) => {
    return `${patient.firstName} ${patient.lastName} (ID: ${patient.id})`;
  };

  const getDoctorDisplay = (doctor) => {
    return `Dr. ${doctor.name} - ${doctor.specialization}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient & Doctor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="UserCheck" className="w-5 h-5 mr-2 text-primary" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Patient <span className="text-error ml-1">*</span>
              </label>
              <select
                value={formData.patientId}
                onChange={(e) => handleInputChange("patientId", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.Id} value={patient.Id}>
                    {getPatientDisplay(patient)}
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-sm text-error font-medium">{errors.patientId}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Doctor <span className="text-error ml-1">*</span>
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => handleInputChange("doctorId", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-secondary focus:ring-4 focus:ring-secondary/10 focus:outline-none"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.Id} value={doctor.Id}>
                    {getDoctorDisplay(doctor)}
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="text-sm text-error font-medium">{errors.doctorId}</p>}
            </div>
          </div>

          {selectedDoctor && (
            <div className="bg-gradient-to-r from-secondary/10 to-secondary/20 p-4 rounded-lg border border-secondary/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-secondary-700 rounded-full flex items-center justify-center shadow-lg">
                  <ApperIcon name="UserCheck" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Dr. {selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                  <p className="text-xs text-gray-500">Default slot duration: {selectedDoctor.appointmentDuration} minutes</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-accent" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              error={errors.date}
              min={format(new Date(), "yyyy-MM-dd")}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Time Slot <span className="text-error ml-1">*</span>
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => handleInputChange("timeSlot", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none"
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.timeSlot && <p className="text-sm text-error font-medium">{errors.timeSlot}</p>}
            </div>

            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
              min="15"
              max="120"
              step="15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointment Type & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Stethoscope" className="w-5 h-5 mr-2 text-warning" />
            Appointment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Type <span className="text-error ml-1">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-warning focus:ring-4 focus:ring-warning/10 focus:outline-none"
              >
                <option value="">Select type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-sm text-error font-medium">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none resize-none"
              placeholder="Enter any additional notes or special instructions..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          icon="Calendar"
        >
          {appointment ? "Update Appointment" : "Book Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;