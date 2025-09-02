import patientsData from "@/services/mockData/patients.json";

export const PatientService = {
  // Simulate API delay
  delay: () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200)),

  // Get all patients
  getAll: async () => {
    await PatientService.delay();
    return [...patientsData];
  },

  // Get patient by ID
  getById: async (id) => {
    await PatientService.delay();
    const patient = patientsData.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  // Create new patient
  create: async (patientData) => {
    await PatientService.delay();
    const maxId = Math.max(...patientsData.map(p => p.Id));
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      id: `PAT${String(maxId + 1).padStart(3, "0")}`,
      registrationDate: new Date().toISOString()
    };
    patientsData.push(newPatient);
    return { ...newPatient };
  },

  // Update patient
  update: async (id, patientData) => {
    await PatientService.delay();
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    
    const updatedPatient = {
      ...patientsData[index],
      ...patientData,
      Id: parseInt(id)
    };
    patientsData[index] = updatedPatient;
    return { ...updatedPatient };
  },

  // Delete patient
  delete: async (id) => {
    await PatientService.delay();
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    
    const deletedPatient = patientsData.splice(index, 1)[0];
    return { ...deletedPatient };
  }
};