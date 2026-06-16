import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ScheduleCard = ({ item, navigation }) => {
  const totalSeats = item.busId?.seatCount || 0;
  const bookedCount = item.bookedSeats?.length || 0;
  const availableSeats = totalSeats - bookedCount;

  const startLoc = item.routeId?.startLocation || "Start";
  const endLoc = item.routeId?.endLocation || "End";
  const depTime = item.departureTime || "--:--";
  const arrTime = item.arrivalTime || "--:--";
  const duration = item.routeId?.estimatedDuration || "N/A";
  const price = item.routeId?.price || 0;
  
  const isMidnightJourney = depTime.includes("PM") && arrTime.includes("AM");
  
  const departureDateObj = new Date(item.departureDate);
  const departureDateString = departureDateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
  
  const arrivalDateObj = new Date(item.departureDate);
  if (isMidnightJourney) arrivalDateObj.setDate(arrivalDateObj.getDate() + 1);
  const arrivalDateString = arrivalDateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });

  // Calculate duration if it is missing or N/A
  const calculateDuration = (start, end) => {
    if (!start || !end || start === "--:--" || end === "--:--") return "N/A";
    try {
      const parseTime = (timeStr) => {
        const parts = timeStr.trim().split(' ');
        let [hours, minutes] = parts[0].split(':');
        if (!hours || !minutes) return null;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (parts[1] === 'PM' && hours < 12) hours += 12;
        if (parts[1] === 'AM' && hours === 12) hours = 0;
        return new Date(2000, 0, 1, hours, minutes);
      };
      
      const d1 = parseTime(start);
      let d2 = parseTime(end);
      if (!d1 || !d2) return duration;

      if (d2 < d1) d2.setDate(d2.getDate() + 1);
      
      const diffMs = d2 - d1;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.round((diffMs % 3600000) / 60000);
      if (diffHrs === 0) return `${diffMins}m`;
      if (diffMins === 0) return `${diffHrs}h`;
      return `${diffHrs}h ${diffMins}m`;
    } catch {
      return duration;
    }
  };

  const displayDuration = duration && duration !== "N/A" ? duration : calculateDuration(depTime, arrTime);

  return (
    <View 
      className="mb-6 bg-white rounded-3xl p-7 border border-border overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
      }}
    >
      
      {/* Header - Route & Operator & Pricing */}
      <View className="flex-row items-start justify-between mb-8">
        <View className="flex-1 mr-4">
          <Text className="text-textDark text-2xl font-black tracking-tight mb-2">{startLoc} - {endLoc}</Text>
          <Text className="text-textMuted text-sm font-medium">
            {item.busId?.licenseNumber || "Bus pending"} | {item.busId?.busType || "Standard"}
          </Text>
        </View>
        
        {/* Price & Availability */}
        <View className="items-end">
          {availableSeats === 0 ? (
            <View className="bg-red-50 border border-red-200 rounded px-2 py-1 mb-1">
              <Text className="text-red-600 text-xs font-bold">Fully booked</Text>
            </View>
          ) : (
            <View className="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 mb-1">
              <Text className="text-emerald-700 text-xs font-bold">{availableSeats} Seats left</Text>
            </View>
          )}
          <Text className="text-textDark text-4xl font-black">
            {price.toLocaleString()} <Text className="text-textMuted text-xl font-semibold">LKR</Text>
          </Text>
        </View>
      </View>

      {/* Time and Journey Section */}
      <View className="flex-row items-center justify-between mb-8">
        {/* Departure */}
        <View className="flex-1">
          <Text className="text-primary text-4xl font-black mb-1">{depTime}</Text>
          <View className="bg-slate-100 self-start px-2 py-0.5 rounded text-[10px] mb-2 border border-slate-200">
            <Text className="text-slate-500 text-[10px] font-bold tracking-wider">DEPARTURE</Text>
          </View>
          <Text className="text-textDark font-medium text-sm w-32" numberOfLines={2}>{startLoc}</Text>
          <Text className="text-textMuted text-xs mt-1">{departureDateString}</Text>
        </View>

        {/* Center Arrow & Duration */}
        <View className="flex-[0.8] items-center justify-center -mt-6">
          <View className="w-full flex-row items-center justify-center mb-1">
            <View className="flex-1 h-[1px] bg-slate-300" />
            <Ionicons name="arrow-forward" size={16} color="#94A3B8" className="mx-1" />
            <View className="flex-1 h-[1px] bg-slate-300" />
          </View>
          <View className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 flex-row items-center">
            <Ionicons name="time-outline" size={12} color="#64748B" className="mr-1" />
            <Text className="text-slate-600 text-xs font-bold tracking-wide">{displayDuration}</Text>
          </View>
        </View>

        {/* Arrival */}
        <View className="flex-1 items-end text-right">
          <Text className="text-primary text-4xl font-black mb-1 text-right">{arrTime}</Text>
          <View className="bg-slate-100 self-end px-2 py-0.5 rounded text-[10px] mb-2 border border-slate-200">
            <Text className="text-slate-500 text-[10px] font-bold tracking-wider">ARRIVAL</Text>
          </View>
          <Text className="text-textDark font-medium text-sm text-right w-32" numberOfLines={2}>{endLoc}</Text>
          <View className="flex-row items-center mt-1">
            {isMidnightJourney && <Text className="text-red-500 text-xs font-bold mr-1">+1 Day</Text>}
            <Text className="text-textMuted text-xs text-right">{arrivalDateString}</Text>
          </View>
        </View>
      </View>

      {/* Midnight Journey Warning */}
      {isMidnightJourney && (
        <View className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex-row items-center mb-6">
          <Ionicons name="warning" size={16} color="#D97706" className="mr-2" />
          <Text className="text-amber-700 font-bold text-xs flex-1">
            Midnight Journey — <Text className="text-amber-600 font-normal">This journey starts before midnight and continues into the next day. Please plan accordingly.</Text>
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row items-center justify-end border-t border-slate-100 pt-5 mt-2">
        <TouchableOpacity 
          className={`rounded-full px-6 py-3 flex-row items-center justify-center ${availableSeats === 0 ? 'bg-slate-300' : 'bg-primary'}`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
          }}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
          disabled={availableSeats === 0}
        >
          <Text className="text-white text-sm font-bold mr-1">
            {availableSeats === 0 ? 'Sold Out' : 'Book Ticket'}
          </Text>
          {availableSeats > 0 && <Ionicons name="chevron-forward" size={16} color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleCard;
