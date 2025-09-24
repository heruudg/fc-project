import { useState } from 'react'
import vehicleConfig from './vehicleConfig.json'
import translations from './translations.json'

interface VehicleType {
  id: string
  name: string
  kmPerLiter: number
}

type Language = 'en' | 'id'

function App() {
  const [kmA, setKmA] = useState<string>('')
  const [kmB, setKmB] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string>('')
  const [language, setLanguage] = useState<Language>('id') // Default to Indonesian

  const vehicleTypes: VehicleType[] = vehicleConfig.vehicleTypes
  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en')
    setError('') // Clear error when switching language
  }

  const calculateFuelConsumption = () => {
    // Reset error and result
    setError('')
    setResult(null)

    // Validation
    if (!kmA || !kmB || !selectedVehicle) {
      setError(t.errors.fillAllFields)
      return
    }

    const kmANum = parseFloat(kmA)
    const kmBNum = parseFloat(kmB)

    if (isNaN(kmANum) || isNaN(kmBNum)) {
      setError(t.errors.validNumbers)
      return
    }

    if (kmBNum <= kmANum) {
      setError(t.errors.kmBGreater)
      return
    }

    // Find selected vehicle
    const vehicle = vehicleTypes.find(v => v.id === selectedVehicle)
    if (!vehicle) {
      setError(t.errors.validVehicle)
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
          {/* Header with Language Toggle */}
          <div className="text-center mb-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleLanguage}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {language === 'en' ? '🇮🇩 ID' : '🇺🇸 EN'}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ⛽ {t.title}
            </h1>
            <p className="text-gray-600">
              {t.subtitle}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* KM A Input */}
            <div>
              <label htmlFor="kmA" className="block text-sm font-medium text-gray-700 mb-2">
                {t.kmALabel}
              </label>
              <input
                type="number"
                id="kmA"
                value={kmA}
                onChange={(e) => setKmA(e.target.value)}
                placeholder={t.kmAPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* KM B Input */}
            <div>
              <label htmlFor="kmB" className="block text-sm font-medium text-gray-700 mb-2">
                {t.kmBLabel}
              </label>
              <input
                type="number"
                id="kmB"
                value={kmB}
                onChange={(e) => setKmB(e.target.value)}
                placeholder={t.kmBPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                {t.vehicleTypeLabel}
              </label>
              <select
                id="vehicle"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              >
                <option value="">{t.vehicleTypePlaceholder}</option>
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
                  <span className="font-medium">{t.totalDistance}</span> {parseFloat(kmB) - parseFloat(kmA)} km
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
                  🚗 {t.fuelNeeded} <span className="text-2xl">{result}</span> {t.liters}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={calculateFuelConsumption}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t.calculateButton}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t.resetButton}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>{t.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
