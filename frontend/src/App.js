import React, { useState } from 'react';
import AgenticChart from './components/AgenticChart';

function App() {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [formData, setFormData] = useState({
    filePath: "", // e.g., C:/Users/Name/Desktop/sales.xlsx
    prompt: "Show me a bar chart of Revenue by Region",
    sheetName: "Sheet1"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDashboardData(null);

    try {
      const response = await fetch('http://0.0.0.0:8000/generate-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            file_path: formData.filePath,
            prompt: formData.prompt,
            sheet_name: formData.sheetName
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log(result)
        setDashboardData(result);
      } else {
        alert("Error: " + result.detail);
      }
    } catch (error) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Agentic BI Dashboard</h1>
        
        {/* Input Form */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Excel File Absolute Path:</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                placeholder="/Users/username/data/sales.xlsx"
                value={formData.filePath}
                onChange={(e) => setFormData({...formData, filePath: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Natural Language Request:</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                placeholder="Visualize monthly sales trends..."
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Analyzing Excel..." : "Generate Dashboard"}
            </button>
          </form>
        </div>

        {/* Visualization Area */}
        {dashboardData && (
          <AgenticChart 
            data={dashboardData.chartData} 
            config={dashboardData.chartConfig} 
          />
        )}
      </div>
    </div>
  );
}

export default App;