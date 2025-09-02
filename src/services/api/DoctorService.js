import { toast } from 'react-toastify';

export const DoctorService = {
  // Get all doctors
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "license_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "appointment_duration_c"}},
          {"field": {"Name": "schedule_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('doctor_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch doctors:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const doctors = (response.data || []).map(doctor => ({
        ...doctor,
        name: doctor.name_c,
        specialization: doctor.specialization_c,
        license: doctor.license_c,
        phone: doctor.phone_c,
        email: doctor.email_c,
        appointmentDuration: doctor.appointment_duration_c,
        schedule: doctor.schedule_c ? JSON.parse(doctor.schedule_c) : {}
      }));

      return doctors;
    } catch (error) {
      console.error("Error fetching doctors:", error?.response?.data?.message || error);
      toast.error("Failed to load doctors. Please try again.");
      return [];
    }
  },

  // Get doctor by ID
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "license_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "appointment_duration_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      };

      const response = await apperClient.getRecordById('doctor_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch doctor:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.data) {
        const doctor = response.data;
        return {
          ...doctor,
          name: doctor.name_c,
          specialization: doctor.specialization_c,
          license: doctor.license_c,
          phone: doctor.phone_c,
          email: doctor.email_c,
          appointmentDuration: doctor.appointment_duration_c,
          schedule: doctor.schedule_c ? JSON.parse(doctor.schedule_c) : {}
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching doctor:", error?.response?.data?.message || error);
      toast.error("Failed to load doctor. Please try again.");
      return null;
    }
  },

  // Create new doctor
  create: async (doctorData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Name: doctorData.name_c,
        name_c: doctorData.name_c,
        specialization_c: doctorData.specialization_c,
        license_c: doctorData.license_c,
        phone_c: doctorData.phone_c,
        email_c: doctorData.email_c,
        appointment_duration_c: parseInt(doctorData.appointment_duration_c) || 30,
        schedule_c: JSON.stringify(doctorData.schedule_c || {})
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("Failed to create doctor:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Doctor created successfully");
          const doctor = result.data;
          return {
            ...doctor,
            name: doctor.name_c,
            specialization: doctor.specialization_c,
            license: doctor.license_c,
            phone: doctor.phone_c,
            email: doctor.email_c,
            appointmentDuration: doctor.appointment_duration_c,
            schedule: doctor.schedule_c ? JSON.parse(doctor.schedule_c) : {}
          };
        } else {
          console.error("Failed to create doctor:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error creating doctor:", error?.response?.data?.message || error);
      toast.error("Failed to create doctor. Please try again.");
      return null;
    }
  },

  // Update doctor
  update: async (id, doctorData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: doctorData.name_c,
        name_c: doctorData.name_c,
        specialization_c: doctorData.specialization_c,
        license_c: doctorData.license_c,
        phone_c: doctorData.phone_c,
        email_c: doctorData.email_c,
        appointment_duration_c: parseInt(doctorData.appointment_duration_c) || 30,
        schedule_c: JSON.stringify(doctorData.schedule_c || {})
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("Failed to update doctor:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Doctor updated successfully");
          const doctor = result.data;
          return {
            ...doctor,
            name: doctor.name_c,
            specialization: doctor.specialization_c,
            license: doctor.license_c,
            phone: doctor.phone_c,
            email: doctor.email_c,
            appointmentDuration: doctor.appointment_duration_c,
            schedule: doctor.schedule_c ? JSON.parse(doctor.schedule_c) : {}
          };
        } else {
          console.error("Failed to update doctor:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error updating doctor:", error?.response?.data?.message || error);
      toast.error("Failed to update doctor. Please try again.");
      return null;
    }
  },

  // Delete doctor
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

      const response = await apperClient.deleteRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("Failed to delete doctor:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Doctor deleted successfully");
          return true;
        } else {
          console.error("Failed to delete doctor:", result);
          if (result.message) toast.error(result.message);
          return false;
        }
      }
    } catch (error) {
      console.error("Error deleting doctor:", error?.response?.data?.message || error);
      toast.error("Failed to delete doctor. Please try again.");
      return false;
    }
  }
};