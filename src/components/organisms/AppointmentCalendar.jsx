import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfDay } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const AppointmentCalendar = ({ appointments, doctors, patients, onBookAppointment, onViewAppointment }) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = Array.from({ length: 7 }, (_, index) => 
    addDays(currentWeek, index)
  );

  const timeSlots = Array.from({ length: 10 }, (_, index) => {
    const hour = 8 + index;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentsForDateAndTime = (date, timeSlot) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date) && apt.timeSlot === timeSlot
    );
  };

  const getDayAppointments = (date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date)
    );
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
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
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
                onClick={() => {
                  setCurrentWeek(startOfWeek(new Date()));
                  setSelectedDate(new Date());
                }}
              >
                Today
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
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-gray-200">
            {/* Time column header */}
            <div className="p-4 bg-gradient-to-r from-surface to-gray-100 border-r border-gray-200">
              <div className="text-sm font-semibold text-gray-900">Time</div>
            </div>
            
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-4 border-r border-gray-200 cursor-pointer transition-all duration-200 ${
                  isSameDay(day, selectedDate)
                    ? "bg-gradient-to-r from-primary/10 to-primary/20"
                    : "bg-gradient-to-r from-surface to-gray-100 hover:from-gray-100 hover:to-gray-200"
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${
                    isSameDay(day, selectedDate) ? "text-primary" : "text-gray-700"
                  }`}>
                    {format(day, "dd")}
                  </div>
                  <div className="mt-2">
                    <Badge variant="primary" className="text-xs">
                      {getDayAppointments(day).length}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
                {/* Time slot */}
                <div className="p-3 border-r border-gray-200 bg-gradient-to-r from-surface to-gray-100">
                  <div className="text-sm font-medium text-gray-700">{timeSlot}</div>
                </div>
                
                {/* Day slots */}
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDateAndTime(day, timeSlot);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`p-2 border-r border-gray-100 min-h-16 hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 transition-all duration-200 ${
                        timeIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      {dayAppointments.length > 0 ? (
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map((apt) => {
                            const patient = patients.find(p => p.Id === parseInt(apt.patientId));
                            const doctor = doctors.find(d => d.Id === parseInt(apt.doctorId));
                            
                            return (
                              <div
                                key={apt.Id}
                                onClick={() => onViewAppointment(apt)}
                                className="text-xs p-2 rounded-md cursor-pointer transition-all duration-200 hover:shadow-sm bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 hover:from-primary/20 hover:to-primary/30"
                              >
                                <div className="font-semibold text-primary text-[10px] truncate">
                                  {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                                </div>
                                <div className="text-gray-600 text-[10px] truncate">
                                  Dr. {doctor?.name || "Unknown"}
                                </div>
                                <Badge variant={getStatusColor(apt.status)} className="text-[8px] px-1 py-0">
                                  {apt.status}
                                </Badge>
                              </div>
                            );
                          })}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayAppointments.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onBookAppointment(day, timeSlot)}
                          className="w-full h-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors duration-200 hover:bg-primary/5 rounded"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
            Appointments for {format(selectedDate, "EEEE, MMMM dd, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getDayAppointments(selectedDate).length > 0 ? (
              getDayAppointments(selectedDate)
                .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                .map((apt) => {
                  const patient = patients.find(p => p.Id === parseInt(apt.patientId));
                  const doctor = doctors.find(d => d.Id === parseInt(apt.doctorId));
                  
                  return (
                    <div
                      key={apt.Id}
                      onClick={() => onViewAppointment(apt)}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-surface"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                          <ApperIcon name="Clock" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {apt.timeSlot} - {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Dr. {doctor?.name || "Unknown"} • {apt.type}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for this day</p>
                <Button
                  variant="primary"
                  size="sm"
                  icon="Plus"
                  onClick={() => onBookAppointment(selectedDate, "09:00")}
                  className="mt-3"
                >
                  Book Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;