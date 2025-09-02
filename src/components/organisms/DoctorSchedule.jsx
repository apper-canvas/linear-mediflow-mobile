import React, { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const DoctorSchedule = ({ doctors, appointments, onScheduleUpdate, selectedDoctorId }) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedDoctor, setSelectedDoctor] = useState(
    doctors.find(d => d.Id === selectedDoctorId) || doctors[0]
  );

  const weekDays = Array.from({ length: 7 }, (_, index) => 
    addDays(currentWeek, index)
  );

  const timeSlots = Array.from({ length: 10 }, (_, index) => {
    const hour = 8 + index;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getDoctorAppointments = (doctorId, date, timeSlot) => {
    return appointments.filter(apt => 
      parseInt(apt.doctorId) === doctorId &&
      isSameDay(parseISO(apt.date), date) &&
      apt.timeSlot === timeSlot
    );
  };

  const getDoctorDayAppointments = (doctorId, date) => {
    return appointments.filter(apt => 
      parseInt(apt.doctorId) === doctorId &&
      isSameDay(parseISO(apt.date), date)
    );
  };

  const isSlotAvailable = (doctorId, date, timeSlot) => {
    const doctorAppts = getDoctorAppointments(doctorId, date, timeSlot);
    return doctorAppts.length === 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "accent",
      pending: "warning",
      cancelled: "error", 
      completed: "primary"
    };
    return colors[status] || "default";
  };

  const navigateWeek = (direction) => {
    const newWeek = addDays(currentWeek, direction * 7);
    setCurrentWeek(newWeek);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ApperIcon name="UserCheck" className="w-5 h-5 mr-2 text-secondary" />
              Doctor Schedule
            </CardTitle>
            <div className="flex items-center space-x-4">
              <select
                value={selectedDoctor.Id}
                onChange={(e) => setSelectedDoctor(doctors.find(d => d.Id === parseInt(e.target.value)))}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all duration-200"
              >
                {doctors.map((doctor) => (
                  <option key={doctor.Id} value={doctor.Id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-700 rounded-full flex items-center justify-center shadow-lg">
                <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {selectedDoctor.name}
                </h3>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                <p className="text-xs text-gray-500">License: {selectedDoctor.license}</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-3 rounded-lg border border-primary/30">
                <div className="text-xs font-medium text-primary uppercase tracking-wide">Contact</div>
                <div className="text-sm font-semibold text-gray-900">{selectedDoctor.phone}</div>
              </div>
              <div className="bg-gradient-to-r from-accent/10 to-accent/20 p-3 rounded-lg border border-accent/30">
                <div className="text-xs font-medium text-accent uppercase tracking-wide">Email</div>
                <div className="text-sm font-semibold text-gray-900">{selectedDoctor.email}</div>
              </div>
              <div className="bg-gradient-to-r from-warning/10 to-warning/20 p-3 rounded-lg border border-warning/30">
                <div className="text-xs font-medium text-warning uppercase tracking-wide">Slot Duration</div>
                <div className="text-sm font-semibold text-gray-900">{selectedDoctor.appointmentDuration} min</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Week of {format(currentWeek, "MMMM dd, yyyy")}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon="ChevronLeft"
                onClick={() => navigateWeek(-1)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeek(startOfWeek(new Date()))}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="ChevronRight"
                onClick={() => navigateWeek(1)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-gray-200">
            {/* Time column header */}
            <div className="p-4 bg-gradient-to-r from-surface to-gray-100 border-r border-gray-200">
              <div className="text-sm font-semibold text-gray-900">Time</div>
            </div>
            
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 border-r border-gray-200 bg-gradient-to-r from-surface to-gray-100">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {format(day, "EEE")}
                  </div>
                  <div className="text-lg font-bold text-gray-700 mt-1">
                    {format(day, "dd")}
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {getDoctorDayAppointments(selectedDoctor.Id, day).length}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
                {/* Time slot */}
                <div className="p-3 border-r border-gray-200 bg-gradient-to-r from-surface to-gray-100">
                  <div className="text-sm font-medium text-gray-700">{timeSlot}</div>
                </div>
                
                {/* Day slots */}
                {weekDays.map((day, dayIndex) => {
                  const appointments = getDoctorAppointments(selectedDoctor.Id, day, timeSlot);
                  const isAvailable = isSlotAvailable(selectedDoctor.Id, day, timeSlot);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`p-2 border-r border-gray-100 min-h-16 transition-all duration-200 ${
                        timeIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      } ${isAvailable ? "hover:bg-gradient-to-r hover:from-accent/5 hover:to-accent/10" : ""}`}
                    >
                      {appointments.length > 0 ? (
                        <div className="space-y-1">
                          {appointments.map((apt) => (
                            <div
                              key={apt.Id}
                              className="text-xs p-2 rounded-md bg-gradient-to-r from-secondary/10 to-secondary/20 border border-secondary/20"
                            >
                              <div className="font-semibold text-secondary text-[10px]">
                                Patient ID: {apt.patientId}
                              </div>
                              <div className="text-gray-600 text-[10px]">
                                {apt.type}
                              </div>
                              <Badge variant={getStatusColor(apt.status)} className="text-[8px] px-1 py-0">
                                {apt.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-accent to-green-600 rounded-full flex items-center justify-center">
                            <ApperIcon name="Check" className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weekDays.reduce((total, day) => 
                    total + getDoctorDayAppointments(selectedDoctor.Id, day).length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Slots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weekDays.reduce((total, day) => 
                    total + timeSlots.filter(slot => 
                      isSlotAvailable(selectedDoctor.Id, day, slot)
                    ).length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="Clock" className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((weekDays.reduce((total, day) => 
                    total + getDoctorDayAppointments(selectedDoctor.Id, day).length, 0
                  ) / (weekDays.length * timeSlots.length)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSchedule;