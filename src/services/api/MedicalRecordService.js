import medicalRecordsData from "@/services/mockData/medicalRecords.json";

export const MedicalRecordService = {
  // Simulate API delay
  delay: () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200)),

  // Get all medical records
  getAll: async () => {
    await MedicalRecordService.delay();
    return [...medicalRecordsData];
  },

  // Get medical record by ID
  getById: async (id) => {
    await MedicalRecordService.delay();
    const record = medicalRecordsData.find(r => r.Id === parseInt(id));
    if (!record) {
      throw new Error("Medical record not found");
    }
    return { ...record };
  },

  // Get records by patient ID
  getByPatientId: async (patientId) => {
    await MedicalRecordService.delay();
    return medicalRecordsData.filter(r => r.patientId === String(patientId));
  },

  // Create new medical record
  create: async (recordData) => {
    await MedicalRecordService.delay();
    const maxId = Math.max(...medicalRecordsData.map(r => r.Id));
    const newRecord = {
      ...recordData,
      Id: maxId + 1,
      patientId: String(recordData.patientId),
      doctorId: String(recordData.doctorId),
      visitDate: recordData.visitDate || new Date().toISOString()
    };
    medicalRecordsData.push(newRecord);
    return { ...newRecord };
  },

  // Update medical record
  update: async (id, recordData) => {
    await MedicalRecordService.delay();
    const index = medicalRecordsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    
    const updatedRecord = {
      ...medicalRecordsData[index],
      ...recordData,
      Id: parseInt(id),
      patientId: String(recordData.patientId),
      doctorId: String(recordData.doctorId)
    };
    medicalRecordsData[index] = updatedRecord;
    return { ...updatedRecord };
  },

  // Delete medical record
  delete: async (id) => {
    await MedicalRecordService.delay();
    const index = medicalRecordsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    
    const deletedRecord = medicalRecordsData.splice(index, 1)[0];
    return { ...deletedRecord };
  }
};