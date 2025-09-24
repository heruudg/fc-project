import { useState } from 'react'
import vehicleConfig from './vehicleConfig.json'

interface VehicleType {
  id: string
  name: string
  kmPerLiter: number
}

function App() {
  const [kmA, setKmA] = useState<string>('')
  const [kmB, setKmB] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  const vehicleTypes: VehicleType[] = vehicleConfig.vehicleTypes

  const calculateFuelConsumption = () => {
    // Reset error and result
    setError('')
    setResult(null)

    // Validation
    if (!kmA || !kmB || !selectedVehicle) {
      setError('Please fill in all fields')
      return
    }

    const kmANum = parseFloat(kmA)
    const kmBNum = parseFloat(kmB)

    if (isNaN(kmANum) || isNaN(kmBNum)) {
      setError('Please enter valid numbers for kilometers')
      return
    }

    if (kmBNum <= kmANum) {
      setError('KM B must be greater than KM A')
      return
    }

    // Find selected vehicle
    const vehicle = vehicleTypes.find(v => v.id === selectedVehicle)
    if (!vehicle) {
      setError('Please select a valid vehicle type')
      return
    }

    // Calculate fuel consumption
    const totalKm = kmBNum - kmANum
    const fuelNeeded = totalKm / vehicle.kmPerLiter
    setResult(Math.round(fuelNeeded * 100) / 100) // Round to 2 decimal places
  }

  const resetForm = () => {
    setKmA('')
    setKmB('')
    setSelectedVehicle('')
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ⛽ Fuel Calculator
            </h1>
            <p className="text-gray-600">
              Calculate fuel consumption for your journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* KM A Input */}
            <div>
              <label htmlFor="kmA" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Point (KM A)
              </label>
              <input
                type="number"
                id="kmA"
                value={kmA}
                onChange={(e) => setKmA(e.target.value)}
                placeholder="Enter starting kilometer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* KM B Input */}
            <div>
              <label htmlFor="kmB" className="block text-sm font-medium text-gray-700 mb-2">
                Destination (KM B)
              </label>
              <input
                type="number"
                id="kmB"
                value={kmB}
                onChange={(e) => setKmB(e.target.value)}
                placeholder="Enter destination kilometer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                id="vehicle"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.kmPerLiter} km/L)
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Display */}
            {kmA && kmB && !isNaN(parseFloat(kmA)) && !isNaN(parseFloat(kmB)) && parseFloat(kmB) > parseFloat(kmA) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Total Distance:</span> {parseFloat(kmB) - parseFloat(kmA)} km
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">❌ {error}</p>
              </div>
            )}

            {/* Result Display */}
            {result !== null && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-lg font-semibold text-green-800 text-center">
                  🚗 Fuel Needed: <span className="text-2xl">{result}</span> liters
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={calculateFuelConsumption}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Calculate
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>💡 Tip: Make sure KM B is greater than KM A</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
