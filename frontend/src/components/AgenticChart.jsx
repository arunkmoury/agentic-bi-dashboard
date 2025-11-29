import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AgenticChart = ({ data, config }) => {
  if (!data || !config) return null;

  const renderChart = () => {
    switch (config.type) {
      case 'LineChart':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={config.colors?.[index] || COLORS[index % COLORS.length]} />
            ))}
          </LineChart>
        );
      case 'BarChart':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={config.colors?.[index] || COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        );
      default:
        return <div>Unsupported Chart Type: {config.type}</div>;
    }
  };

  return (
    <div className="w-full h-96 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">{config.title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AgenticChart;