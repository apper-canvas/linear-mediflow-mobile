import { toast } from "react-toastify";
import React from "react";

export const MedicalRecordService = {
  // Get all medical records
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "vital_signs_c"}},
          {"field": {"Name": "vital_signs_blood_pressure_c"}},
          {"field": {"Name": "vital_signs_heart_rate_c"}},
          {"field": {"Name": "vital_signs_temperature_c"}},
          {"field": {"Name": "vital_signs_weight_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch medical records:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const records = (response.data || []).map(record => ({
        ...record,
        patientId: record.patient_id_c?.Id?.toString() || record.patient_id_c?.toString() || "",
        doctorId: record.doctor_id_c?.Id?.toString() || record.doctor_id_c?.toString() || "",
        visitDate: record.visit_date_c,
        diagnosis: record.diagnosis_c,
        prescription: record.prescription_c ? JSON.parse(record.prescription_c) : [],
        notes: record.notes_c,
        vitalSigns: {
          bloodPressure: record.vital_signs_blood_pressure_c || "",
          heartRate: record.vital_signs_heart_rate_c || "",
          temperature: record.vital_signs_temperature_c || "",
          weight: record.vital_signs_weight_c || ""
        }
      }));

      return records;
    } catch (error) {
      console.error("Error fetching medical records:", error?.response?.data?.message || error);
      toast.error("Failed to load medical records. Please try again.");
      return [];
    }
  },

  // Get medical record by ID
  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "vital_signs_c"}},
          {"field": {"Name": "vital_signs_blood_pressure_c"}},
          {"field": {"Name": "vital_signs_heart_rate_c"}},
          {"field": {"Name": "vital_signs_temperature_c"}},
          {"field": {"Name": "vital_signs_weight_c"}}
        ]
      };

      const response = await apperClient.getRecordById('medical_record_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch medical record:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.data) {
        const record = response.data;
        return {
          ...record,
          patientId: record.patient_id_c?.Id?.toString() || record.patient_id_c?.toString() || "",
          doctorId: record.doctor_id_c?.Id?.toString() || record.doctor_id_c?.toString() || "",
          visitDate: record.visit_date_c,
          diagnosis: record.diagnosis_c,
          prescription: record.prescription_c ? JSON.parse(record.prescription_c) : [],
          notes: record.notes_c,
          vitalSigns: {
            bloodPressure: record.vital_signs_blood_pressure_c || "",
            heartRate: record.vital_signs_heart_rate_c || "",
            temperature: record.vital_signs_temperature_c || "",
            weight: record.vital_signs_weight_c || ""
          }
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching medical record:", error?.response?.data?.message || error);
      toast.error("Failed to load medical record. Please try again.");
      return null;
    }
  },

  // Get records by patient ID
  getByPatientId: async (patientId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "prescription_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "vital_signs_c"}},
          {"field": {"Name": "vital_signs_blood_pressure_c"}},
          {"field": {"Name": "vital_signs_heart_rate_c"}},
          {"field": {"Name": "vital_signs_temperature_c"}},
          {"field": {"Name": "vital_signs_weight_c"}}
        ],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}],
        orderBy: [{"fieldName": "visit_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch patient medical records:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const records = (response.data || []).map(record => ({
        ...record,
        patientId: record.patient_id_c?.Id?.toString() || record.patient_id_c?.toString() || "",
        doctorId: record.doctor_id_c?.Id?.toString() || record.doctor_id_c?.toString() || "",
        visitDate: record.visit_date_c,
        diagnosis: record.diagnosis_c,
        prescription: record.prescription_c ? JSON.parse(record.prescription_c) : [],
        notes: record.notes_c,
        vitalSigns: {
          bloodPressure: record.vital_signs_blood_pressure_c || "",
          heartRate: record.vital_signs_heart_rate_c || "",
          temperature: record.vital_signs_temperature_c || "",
          weight: record.vital_signs_weight_c || ""
        }
      }));

      return records;
    } catch (error) {
      console.error("Error fetching patient medical records:", error?.response?.data?.message || error);
      toast.error("Failed to load patient medical records. Please try again.");
      return [];
    }
  },

  // Create new medical record
  create: async (recordData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Name: `${recordData.diagnosis_c} - ${recordData.visit_date_c}`,
        patient_id_c: parseInt(recordData.patientId),
        doctor_id_c: parseInt(recordData.doctorId),
        visit_date_c: recordData.visit_date_c || new Date().toISOString().split('T')[0],
        diagnosis_c: recordData.diagnosis_c,
        prescription_c: JSON.stringify(recordData.prescription || []),
        notes_c: recordData.notes_c || "",
        vital_signs_c: JSON.stringify(recordData.vitalSigns || {}),
        vital_signs_blood_pressure_c: recordData.vitalSigns?.bloodPressure || "",
        vital_signs_heart_rate_c: recordData.vitalSigns?.heartRate || "",
        vital_signs_temperature_c: recordData.vitalSigns?.temperature || "",
        vital_signs_weight_c: recordData.vitalSigns?.weight || ""
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("Failed to create medical record:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Medical record created successfully");
          const record = result.data;
          return {
            ...record,
            patientId: record.patient_id_c?.Id?.toString() || record.patient_id_c?.toString() || "",
            doctorId: record.doctor_id_c?.Id?.toString() || record.doctor_id_c?.toString() || "",
            visitDate: record.visit_date_c,
            diagnosis: record.diagnosis_c,
            prescription: record.prescription_c ? JSON.parse(record.prescription_c) : [],
            notes: record.notes_c,
            vitalSigns: {
              bloodPressure: record.vital_signs_blood_pressure_c || "",
              heartRate: record.vital_signs_heart_rate_c || "",
              temperature: record.vital_signs_temperature_c || "",
              weight: record.vital_signs_weight_c || ""
            }
          };
        } else {
          console.error("Failed to create medical record:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error creating medical record:", error?.response?.data?.message || error);
      toast.error("Failed to create medical record. Please try again.");
      return null;
    }
  },

  // Update medical record
  update: async (id, recordData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: `${recordData.diagnosis_c} - ${recordData.visit_date_c}`,
        patient_id_c: parseInt(recordData.patientId),
        doctor_id_c: parseInt(recordData.doctorId),
        visit_date_c: recordData.visit_date_c,
        diagnosis_c: recordData.diagnosis_c,
        prescription_c: JSON.stringify(recordData.prescription || []),
        notes_c: recordData.notes_c || "",
        vital_signs_c: JSON.stringify(recordData.vitalSigns || {}),
        vital_signs_blood_pressure_c: recordData.vitalSigns?.bloodPressure || "",
        vital_signs_heart_rate_c: recordData.vitalSigns?.heartRate || "",
        vital_signs_temperature_c: recordData.vitalSigns?.temperature || "",
        vital_signs_weight_c: recordData.vitalSigns?.weight || ""
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("Failed to update medical record:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Medical record updated successfully");
          const record = result.data;
          return {
            ...record,
            patientId: record.patient_id_c?.Id?.toString() || record.patient_id_c?.toString() || "",
            doctorId: record.doctor_id_c?.Id?.toString() || record.doctor_id_c?.toString() || "",
            visitDate: record.visit_date_c,
            diagnosis: record.diagnosis_c,
            prescription: record.prescription_c ? JSON.parse(record.prescription_c) : [],
            notes: record.notes_c,
            vitalSigns: {
              bloodPressure: record.vital_signs_blood_pressure_c || "",
              heartRate: record.vital_signs_heart_rate_c || "",
              temperature: record.vital_signs_temperature_c || "",
              weight: record.vital_signs_weight_c || ""
            }
          };
        } else {
          console.error("Failed to update medical record:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error updating medical record:", error?.response?.data?.message || error);
      toast.error("Failed to update medical record. Please try again.");
      return null;
    }
  },

  // Delete medical record
  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("Failed to delete medical record:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Medical record deleted successfully");
          return true;
        } else {
          console.error("Failed to delete medical record:", result);
          if (result.message) toast.error(result.message);
          return false;
        }
      }
    } catch (error) {
      console.error("Error deleting medical record:", error?.response?.data?.message || error);
      toast.error("Failed to delete medical record. Please try again.");
      return false;
    }
}
};