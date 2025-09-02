import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import { format, parseISO } from "date-fns";

const PatientTable = ({ patients, onViewPatient, onEditPatient, onDeletePatient }) => {
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "dateOfBirth" || sortField === "registrationDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "A+": "error",
      "A-": "error",
      "B+": "info",
      "B-": "info", 
      "AB+": "secondary",
      "AB-": "secondary",
      "O+": "accent",
      "O-": "accent"
    };
    return colors[bloodType] || "default";
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-semibold text-gray-900 hover:text-primary transition-colors duration-200 group"
    >
      <span>{children}</span>
      {sortField === field && (
        <ApperIcon 
          name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-primary" 
        />
      )}
      {sortField !== field && (
        <ApperIcon 
          name="ChevronsUpDown" 
          className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
        />
      )}
    </button>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-surface to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="firstName">Patient</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="dateOfBirth">Age</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="registrationDate">Registered</SortButton>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedPatients.map((patient, index) => (
                <tr 
                  key={patient.Id} 
                  className={`hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(parseISO(patient.dateOfBirth), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getBloodTypeColor(patient.bloodType)}>
                      {patient.bloodType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(patient.registrationDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Eye"
                        onClick={() => onViewPatient(patient)}
                        className="text-primary hover:text-primary-700"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEditPatient(patient)}
                        className="text-gray-600 hover:text-gray-900"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => onDeletePatient(patient.Id)}
                        className="text-error hover:text-red-700"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientTable;