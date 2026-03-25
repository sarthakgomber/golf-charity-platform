'use client'

import { useState, useEffect } from 'react'

export default function CharityList() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching charities
    setTimeout(() => {
      setCharities([
        {
          id: 1,
          name: "St. Jude Children's Research Hospital",
          description: "Finding cures. Saving children's lives.",
          website: "https://www.stjude.org",
          logo: "stjude-logo.png"
        },
        {
          id: 2,
          name: "World Wildlife Fund",
          description: "Protecting endangered species and habitats worldwide.",
          website: "https://www.worldwildlife.org",
          logo: "wwf-logo.png"
        },
        {
          id: 3,
          name: "Doctors Without Borders",
          description: "Medical humanitarian assistance where it's needed most.",
          website: "https://www.doctorswithoutborders.org",
          logo: "msf-logo.png"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Our Charities</h1>
        <p className="text-gray-600">Discover and support organizations making a difference in the world.</p>
      </div>
      
      <div className="charities-grid">
        {charities.map((charity) => (
          <div key={charity.id} className="card">
            <div className="p-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{charity.name}</h3>
              <p className="text-gray-600 mb-4">{charity.description}</p>
              <a 
                href={charity.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary text-center block"
              >
                Visit Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
