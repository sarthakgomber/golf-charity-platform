'use client'

import { useState } from 'react'

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    selectedCharity: 'St. Jude Children\'s Research Hospital',
    charityPercentage: 15
  })
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would make an API call here
    setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Your Profile</h1>
        
        {success && (
          <div className="alert-success">
            {success}
          </div>
        )}
        
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="selectedCharity" className="block text-gray-700 mb-2">Selected Charity</label>
              <select
                id="selectedCharity"
                value={formData.selectedCharity}
                onChange={handleChange}
                className="form-input"
              >
                <option value="St. Jude Children's Research Hospital">St. Jude Children's Research Hospital</option>
                <option value="World Wildlife Fund">World Wildlife Fund</option>
                <option value="Doctors Without Borders">Doctors Without Borders</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="charityPercentage" className="block text-gray-700 mb-2">
                Charity Percentage: {formData.charityPercentage}%
              </label>
              <input
                type="range"
                id="charityPercentage"
                min="10"
                max="100"
                value={formData.charityPercentage}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                type="submit" 
                className="btn-primary py-3 px-6"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
