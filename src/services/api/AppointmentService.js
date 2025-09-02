import appointmentsData from "@/services/mockData/appointments.json";

export const AppointmentService = {
  // Simulate API delay
  delay: () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200)),

  // Get all appointments
  getAll: async () => {
    await AppointmentService.delay();
    return [...appointmentsData];
  },

  // Get appointment by ID
  getById: async (id) => {
    await AppointmentService.delay();
    const appointment = appointmentsData.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  // Create new appointment
  create: async (appointmentData) => {
    await AppointmentService.delay();
    const maxId = Math.max(...appointmentsData.map(a => a.Id));
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      patientId: String(appointmentData.patientId),
      doctorId: String(appointmentData.doctorId)
    };
    appointmentsData.push(newAppointment);
    return { ...newAppointment };
  },

  // Update appointment
  update: async (id, appointmentData) => {
    await AppointmentService.delay();
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    const updatedAppointment = {
      ...appointmentsData[index],
      ...appointmentData,
      Id: parseInt(id),
      patientId: String(appointmentData.patientId),
      doctorId: String(appointmentData.doctorId)
    };
    appointmentsData[index] = updatedAppointment;
    return { ...updatedAppointment };
  },

  // Delete appointment
  delete: async (id) => {
    await AppointmentService.delay();
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    const deletedAppointment = appointmentsData.splice(index, 1)[0];
    return { ...deletedAppointment };
  }
};