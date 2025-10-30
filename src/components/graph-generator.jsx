import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraphGenerator() {
  const [data, setData] = useState([
    { name: 'Janvier', value: 65 },
    { name: 'Février', value: 78 },
    { name: 'Mars', value: 82 },
    { name: 'Avril', value: 71 }
  ]);
  
  const [chartType, setChartType] = useState('line');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const addDataPoint = () => {
    if (newName && newValue) {
      setData([...data, { name: newName, value: parseFloat(newValue) }]);
      setNewName('');
      setNewValue('');
    }
  };

  const deleteDataPoint = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setNewName(data[index].name);
    setNewValue(data[index].value.toString());
  };

  const saveEdit = () => {
    if (editingIndex !== null && newName && newValue) {
      const updatedData = [...data];
      updatedData[editingIndex] = { name: newName, value: parseFloat(newValue) };
      setData(updatedData);
      setEditingIndex(null);
      setNewName('');
      setNewValue('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewName('');
    setNewValue('');
  };

  const exportToJSON = () => {
    const jsonData = {
      chartType,
      data,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graphique-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (jsonData.data && Array.isArray(jsonData.data)) {
            setData(jsonData.data);
            if (jsonData.chartType) {
              setChartType(jsonData.chartType);
            }
          }
        } catch (error) {
          alert('Erreur lors de la lecture du fichier JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} name="Valeur" dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Valeur" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(entry) => `${entry.name}: ${entry.value}`}
                labelLine={{ stroke: '#6b7280' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
  <div className={`${darkMode ? 'dark' : ''}`}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Générateur de Graphiques</h1>
          <p className="text-gray-600 mb-6">Créez, visualisez et exportez vos graphiques facilement !</p>
          
          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Type de graphique</label>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setChartType('line')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  chartType === 'line'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 Courbe
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  chartType === 'bar'
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Histogramme
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  chartType === 'pie'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🥧 Camembert
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
            {renderChart()}
          </div>

          {/* Data Input */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingIndex !== null ? '✏️ Modifier une donnée' : '➕ Ajouter une donnée'}
            </h2>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom / Catégorie</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Janvier, Lundi..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Ex: 65"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              {editingIndex !== null ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    💾 Sauvegarder
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors"
                  >
                    ❌ Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={addDataPoint}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  ➕ Ajouter
                </button>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Données actuelles ({data.length})</h2>
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Valeur</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{item.value}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => startEdit(index)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 mr-2 text-sm font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => deleteDataPoint(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export/Import */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={exportToJSON}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
            >
              💾 Exporter en JSON
            </button>
            <label className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-md">
              📁 Importer JSON
              <input
                type="file"
                accept=".json"
                onChange={importFromJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Comment utiliser cet outil ?</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Choisissez</strong> le type de graphique (courbe, histogramme ou camembert)</li>
            <li>✅ <strong>Ajoutez</strong> vos données avec un nom et une valeur</li>
            <li>✅ <strong>Modifiez</strong> ou supprimez les données dans le tableau</li>
            <li>✅ <strong>Exportez</strong> votre travail en JSON pour le réutiliser plus tard</li>
            <li>✅ <strong>Importez</strong> un fichier JSON pour reprendre un graphique sauvegardé</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
}
