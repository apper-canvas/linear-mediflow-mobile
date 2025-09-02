import doctorsData from "@/services/mockData/doctors.json";

export const DoctorService = {
  // Simulate API delay
  delay: () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200)),

  // Get all doctors
  getAll: async () => {
    await DoctorService.delay();
    return [...doctorsData];
  },

  // Get doctor by ID
  getById: async (id) => {
    await DoctorService.delay();
    const doctor = doctorsData.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  },

  // Create new doctor
  create: async (doctorData) => {
    await DoctorService.delay();
    const maxId = Math.max(...doctorsData.map(d => d.Id));
    const newDoctor = {
      ...doctorData,
      Id: maxId + 1
    };
    doctorsData.push(newDoctor);
    return { ...newDoctor };
  },

  // Update doctor
  update: async (id, doctorData) => {
    await DoctorService.delay();
    const index = doctorsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    
    const updatedDoctor = {
      ...doctorsData[index],
      ...doctorData,
      Id: parseInt(id)
    };
    doctorsData[index] = updatedDoctor;
    return { ...updatedDoctor };
  },

  // Delete doctor
  delete: async (id) => {
    await DoctorService.delay();
    const index = doctorsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    
    const deletedDoctor = doctorsData.splice(index, 1)[0];
    return { ...deletedDoctor };
  }
};