import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const PatientForm = ({ patient, onSubmit, onCancel, isLoading }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    date_of_birth_c: "",
    gender_c: "",
    phone_c: "",
    email_c: "",
    address_c: "",
    emergency_contact_name_c: "",
    emergency_contact_relationship_c: "",
    emergency_contact_phone_c: "",
    allergies_c: [],
    blood_type_c: "",
    registration_date_c: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState({});
  const [newAllergy, setNewAllergy] = useState("");

useEffect(() => {
    if (patient) {
      setFormData({
        first_name_c: patient.first_name_c || "",
        last_name_c: patient.last_name_c || "",
        date_of_birth_c: patient.date_of_birth_c?.split("T")[0] || "",
        gender_c: patient.gender_c || "",
        phone_c: patient.phone_c || "",
        email_c: patient.email_c || "",
        address_c: patient.address_c || "",
        emergency_contact_name_c: patient.emergency_contact_name_c || "",
        emergency_contact_relationship_c: patient.emergency_contact_relationship_c || "",
        emergency_contact_phone_c: patient.emergency_contact_phone_c || "",
        allergies_c: Array.isArray(patient.allergies_c) 
          ? patient.allergies_c 
          : (typeof patient.allergies_c === 'string' ? patient.allergies_c.split(', ').filter(Boolean) : []),
        blood_type_c: patient.blood_type_c || "",
        registration_date_c: patient.registration_date_c?.split("T")[0] || ""
      });
    }
  }, [patient]);

  const validateForm = () => {
    const newErrors = {};
if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
    if (!formData.gender_c) newErrors.gender_c = "Gender is required";
    if (!formData.phone_c.trim()) newErrors.phone_c = "Phone number is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    if (!formData.blood_type_c) newErrors.blood_type_c = "Blood type is required";
if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const handleEmergencyContactChange = (field, value) => {
    const fieldMap = {
      name: 'emergency_contact_name_c',
      relationship: 'emergency_contact_relationship_c',
      phone: 'emergency_contact_phone_c'
    };
    const dbField = fieldMap[field];
    if (dbField) {
      setFormData(prev => ({ ...prev, [dbField]: value }));
    }
  };

const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies_c.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies_c: [...prev.allergies_c, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

const removeAllergy = (allergyToRemove) => {
    setFormData(prev => ({
      ...prev,
      allergies_c: prev.allergies_c.filter(allergy => allergy !== allergyToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="User" className="w-5 h-5 mr-2 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
value={formData.first_name_c}
              onChange={(e) => handleInputChange("first_name_c", e.target.value)}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              required
value={formData.last_name_c}
              onChange={(e) => handleInputChange("last_name_c", e.target.value)}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              required
value={formData.date_of_birth_c}
              onChange={(e) => handleInputChange("date_of_birth_c", e.target.value)}
              error={errors.dateOfBirth}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender <span className="text-error ml-1">*</span>
              </label>
              <select
value={formData.gender_c}
                onChange={(e) => handleInputChange("gender_c", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-sm text-error font-medium">{errors.gender}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Blood Type <span className="text-error ml-1">*</span>
              </label>
              <select
value={formData.blood_type_c}
                onChange={(e) => handleInputChange("blood_type_c", e.target.value)}
                className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodType && <p className="text-sm text-error font-medium">{errors.bloodType}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Phone" className="w-5 h-5 mr-2 text-secondary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
value={formData.phone_c}
              onChange={(e) => handleInputChange("phone_c", e.target.value)}
              error={errors.phone}
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email Address"
              type="email"
              required
value={formData.email_c}
              onChange={(e) => handleInputChange("email_c", e.target.value)}
              error={errors.email}
              placeholder="patient@example.com"
            />
          </div>
          
          <Input
            label="Address"
value={formData.address_c}
            onChange={(e) => handleInputChange("address_c", e.target.value)}
            placeholder="Enter full address"
          />
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="UserPlus" className="w-5 h-5 mr-2 text-accent" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Contact Name"
value={formData.emergency_contact_name_c}
              onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
              placeholder="Full name"
            />
            <Input
              label="Relationship"
              value={formData.emergencyContact.relationship}
value={formData.emergency_contact_relationship_c}
              onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
              placeholder="e.g., Spouse, Parent"
            />
            <Input
              label="Phone Number"
              value={formData.emergencyContact.phone}
value={formData.emergency_contact_phone_c}
              onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Heart" className="w-5 h-5 mr-2 text-error" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                icon="Plus"
                onClick={addAllergy}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
{formData.allergies_c.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-error/10 to-error/20 text-error border border-error/30"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="ml-2 text-error hover:text-red-700"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
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
          icon="Save"
        >
          {patient ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;