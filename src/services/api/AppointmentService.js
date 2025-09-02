import { toast } from 'react-toastify';

export const AppointmentService = {
  // Get all appointments
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_slot_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch appointments:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database response to match UI expectations
      const appointments = (response.data || []).map(appointment => ({
        ...appointment,
        date: appointment.date_c,
        timeSlot: appointment.time_slot_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c,
        patientId: appointment.patient_id_c?.Id?.toString() || appointment.patient_id_c?.toString() || "",
        doctorId: appointment.doctor_id_c?.Id?.toString() || appointment.doctor_id_c?.toString() || ""
      }));

      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments. Please try again.");
      return [];
    }
  },

  // Get appointment by ID
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_slot_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('appointment_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch appointment:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.data) {
        const appointment = response.data;
        return {
          ...appointment,
          date: appointment.date_c,
          timeSlot: appointment.time_slot_c,
          duration: appointment.duration_c,
          type: appointment.type_c,
          status: appointment.status_c,
          notes: appointment.notes_c,
          patientId: appointment.patient_id_c?.Id?.toString() || appointment.patient_id_c?.toString() || "",
          doctorId: appointment.doctor_id_c?.Id?.toString() || appointment.doctor_id_c?.toString() || ""
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching appointment:", error?.response?.data?.message || error);
      toast.error("Failed to load appointment. Please try again.");
      return null;
    }
  },

  // Create new appointment
  create: async (appointmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Name: `${appointmentData.type_c} - ${appointmentData.date_c} ${appointmentData.time_slot_c}`,
        date_c: appointmentData.date_c,
        time_slot_c: appointmentData.time_slot_c,
        duration_c: parseInt(appointmentData.duration_c) || 30,
        type_c: appointmentData.type_c,
        status_c: appointmentData.status_c || "pending",
        notes_c: appointmentData.notes_c || "",
        patient_id_c: parseInt(appointmentData.patientId),
        doctor_id_c: parseInt(appointmentData.doctorId)
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("Failed to create appointment:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Appointment created successfully");
          const appointment = result.data;
          return {
            ...appointment,
            date: appointment.date_c,
            timeSlot: appointment.time_slot_c,
            duration: appointment.duration_c,
            type: appointment.type_c,
            status: appointment.status_c,
            notes: appointment.notes_c,
            patientId: appointment.patient_id_c?.Id?.toString() || appointment.patient_id_c?.toString() || "",
            doctorId: appointment.doctor_id_c?.Id?.toString() || appointment.doctor_id_c?.toString() || ""
          };
        } else {
          console.error("Failed to create appointment:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to create appointment. Please try again.");
      return null;
    }
  },

  // Update appointment
  update: async (id, appointmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map form data to database field names and include only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: `${appointmentData.type_c} - ${appointmentData.date_c} ${appointmentData.time_slot_c}`,
        date_c: appointmentData.date_c,
        time_slot_c: appointmentData.time_slot_c,
        duration_c: parseInt(appointmentData.duration_c) || 30,
        type_c: appointmentData.type_c,
        status_c: appointmentData.status_c || "pending",
        notes_c: appointmentData.notes_c || "",
        patient_id_c: parseInt(appointmentData.patientId),
        doctor_id_c: parseInt(appointmentData.doctorId)
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("Failed to update appointment:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Appointment updated successfully");
          const appointment = result.data;
          return {
            ...appointment,
            date: appointment.date_c,
            timeSlot: appointment.time_slot_c,
            duration: appointment.duration_c,
            type: appointment.type_c,
            status: appointment.status_c,
            notes: appointment.notes_c,
            patientId: appointment.patient_id_c?.Id?.toString() || appointment.patient_id_c?.toString() || "",
            doctorId: appointment.doctor_id_c?.Id?.toString() || appointment.doctor_id_c?.toString() || ""
          };
        } else {
          console.error("Failed to update appointment:", result);
          if (result.errors) {
            result.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          }
          return null;
        }
      }
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to update appointment. Please try again.");
      return null;
    }
  },

  // Delete appointment
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

      const response = await apperClient.deleteRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("Failed to delete appointment:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success("Appointment deleted successfully");
          return true;
        } else {
          console.error("Failed to delete appointment:", result);
          if (result.message) toast.error(result.message);
          return false;
        }
      }
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      toast.error("Failed to delete appointment. Please try again.");
      return false;
    }
  }
};