import { ChartBarIcon, ClockIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { HeaderHome } from '../components/layouts/HeaderHome';

export const Features = () => {
    const features = [
        {
          name: 'Team Collaboration',
          description: 'Seamless real-time collaboration with integrated communication tools',
          icon: UserGroupIcon,
        },
        {
          name: 'Task Analytics',
          description: 'Comprehensive insights with customizable dashboards and reporting',
          icon: ChartBarIcon,
        },
        {
          name: 'Time Tracking',
          description: 'Sophisticated time monitoring with automatic reporting and invoicing',
          icon: ClockIcon,
        },
        {
          name: 'Documentation',
          description: 'Centralized knowledge base for project resources and guidelines',
          icon: DocumentTextIcon,
        }
      ];
  return (
    <>
    <HeaderHome/>
    <div id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full mb-4">FEATURES</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-grade Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything your team needs to manage projects effectively at scale with security and performance in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.name}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                    Learn more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
    

  )
}
