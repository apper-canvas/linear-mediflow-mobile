import { toast } from 'react-toastify';

export const PatientService = {
  // Get all patients
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"Name": "id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch patients:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      toast.error("Failed to load patients. Please try again.");
      return [];
    }
  },

  // Get patient by ID
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"Name": "id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('patient_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch patient:", response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error fetching patient:", error?.response?.data?.message || error);
      toast.error("Failed to load patient. Please try again.");
      return null;
    }
  },

  // Create new patient
  create: async (patientData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Name: `${patientData.first_name_c} ${patientData.last_name_c}`,
        first_name_c: patientData.first_name_c,
        last_name_c: patientData.last_name_c,
        date_of_birth_c: patientData.date_of_birth_c,
        gender_c: patientData.gender_c,
        phone_c: patientData.phone_c,
        email_c: patientData.email_c,
        address_c: patientData.address_c || "",
        emergency_contact_name_c: patientData.emergency_contact_name_c || "",
        emergency_contact_relationship_c: patientData.emergency_contact_relationship_c || "",
        emergency_contact_phone_c: patientData.emergency_contact_phone_c || "",
        allergies_c: Array.isArray(patientData.allergies_c) ? patientData.allergies_c.join(', ') : (patientData.allergies_c || ""),
        blood_type_c: patientData.blood_type_c,
        registration_date_c: new Date().toISOString().split('T')[0],
        id_c: `PAT${Date.now().toString().slice(-3)}`
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('patient_c', params);
      
      if (!response.success) {
        console.error("Failed to create patient:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Patient created successfully");
          return result.data;
        } else {
          console.error("Failed to create patient:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      toast.error("Failed to create patient. Please try again.");
      return null;
    }
  },

  // Update patient
  update: async (id, patientData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: `${patientData.first_name_c} ${patientData.last_name_c}`,
        first_name_c: patientData.first_name_c,
        last_name_c: patientData.last_name_c,
        date_of_birth_c: patientData.date_of_birth_c,
        gender_c: patientData.gender_c,
        phone_c: patientData.phone_c,
        email_c: patientData.email_c,
        address_c: patientData.address_c || "",
        emergency_contact_name_c: patientData.emergency_contact_name_c || "",
        emergency_contact_relationship_c: patientData.emergency_contact_relationship_c || "",
        emergency_contact_phone_c: patientData.emergency_contact_phone_c || "",
        allergies_c: Array.isArray(patientData.allergies_c) ? patientData.allergies_c.join(', ') : (patientData.allergies_c || ""),
        blood_type_c: patientData.blood_type_c,
        id_c: patientData.id_c
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('patient_c', params);
      
      if (!response.success) {
        console.error("Failed to update patient:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Patient updated successfully");
          return result.data;
        } else {
          console.error("Failed to update patient:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      toast.error("Failed to update patient. Please try again.");
      return null;
    }
  },

  // Delete patient
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

      const response = await apperClient.deleteRecord('patient_c', params);
      
      if (!response.success) {
        console.error("Failed to delete patient:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Patient deleted successfully");
          return true;
        } else {
          console.error("Failed to delete patient:", result);
          if (result.message) toast.error(result.message);
          return false;
        }
      }
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      toast.error("Failed to delete patient. Please try again.");
      return false;
    }
  }
};