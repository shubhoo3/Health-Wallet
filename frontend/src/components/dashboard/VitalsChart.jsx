import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-lg font-medium mb-1">No vitals data available</p>
          <p className="text-sm text-gray-400">Start adding vitals to see trends</p>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map(vital => ({
    date: new Date(vital.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    bloodSugar: vital.blood_sugar || null,
    bloodPressure: vital.blood_pressure || null,
    heartRate: vital.heart_rate || null,
    temperature: vital.temperature || null
  })).reverse(); // Show chronologically

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            entry.value && (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: <span className="font-semibold">{entry.value}</span>
              </p>
            )
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            iconType="circle"
          />
          <Line 
            type="monotone" 
            dataKey="bloodSugar" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Blood Sugar (mg/dL)"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="bloodPressure" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Blood Pressure (mmHg)"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="heartRate" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Heart Rate (bpm)"
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Temperature (°F)"
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;