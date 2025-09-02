import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const PatientForm = ({ patient, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    },
    allergies: [],
    bloodType: "",
    registrationDate: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState({});
  const [newAllergy, setNewAllergy] = useState("");

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        dateOfBirth: patient.dateOfBirth?.split("T")[0] || "",
        registrationDate: patient.registrationDate?.split("T")[0] || "",
        emergencyContact: patient.emergencyContact || {
          name: "",
          relationship: "",
          phone: ""
        },
        allergies: patient.allergies || []
      });
    }
  }, [patient]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
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
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              error={errors.dateOfBirth}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender <span className="text-error ml-1">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
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
                value={formData.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
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
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="patient@example.com"
            />
          </div>
          
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
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
              value={formData.emergencyContact.name}
              onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
              placeholder="Full name"
            />
            <Input
              label="Relationship"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
              placeholder="e.g., Spouse, Parent"
            />
            <Input
              label="Phone Number"
              value={formData.emergencyContact.phone}
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
              {formData.allergies.map((allergy, index) => (
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