'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUserData({
        name: "John Doe",
        email: "john@example.com",
        subscription: {
          planType: "monthly",
          status: "active",
          nextBillingDate: "2023-12-01"
        },
        selectedCharity: {
          name: "St. Jude Children's Research Hospital"
        },
        charityPercentage: 15
      })
      
      setScores([
        { value: 32, date: "2023-10-15" },
        { value: 28, date: "2023-10-08" },
        { value: 35, date: "2023-10-01" },
        { value: 30, date: "2023-09-24" },
        { value: 33, date: "2023-09-17" }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">Welcome back, {userData?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Subscription Status</h3>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Plan:</span> {userData?.subscription?.planType}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                userData?.subscription?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userData?.subscription?.status}
              </span>
            </p>
            <p><span className="font-medium">Next billing:</span> {userData?.subscription?.nextBillingDate}</p>
            <Link href="/profile" className="text-green-600 hover:text-green-500 text-sm font-medium mt-2 inline-block">
              Manage subscription →
            </Link>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Your Scores</h3>
          </div>
          <div className="space-y-3">
            {scores.map((score, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium">{score.value} points</span>
                <span className="text-gray-500 text-sm">{new Date(score.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
          <Link href="/scores" className="text-green-600 hover:text-green-500 text-sm font-medium mt-4 inline-block">
            View all scores →
          </Link>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Charity Contribution</h3>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Selected Charity:</span> {userData?.selectedCharity?.name}</p>
            <p><span className="font-medium">Contribution:</span> {userData?.charityPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${userData?.charityPercentage}%` }}
              ></div>
            </div>
            <Link href="/charities" className="text-green-600 hover:text-green-500 text-sm font-medium mt-2 inline-block">
              Change charity →
            </Link>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Upcoming Draws</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium">October Monthly Draw</p>
              <p className="text-sm text-gray-600">Draw date: October 31, 2023</p>
              <p className="text-sm text-gray-600">Status: <span className="text-green-600">Registered</span></p>
            </div>
          </div>
          <Link href="/draws" className="text-green-600 hover:text-green-500 text-sm font-medium mt-4 inline-block">
            View all draws →
          </Link>
        </div>
      </div>
    </div>
  )
}
