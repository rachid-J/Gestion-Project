import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeaderHome } from '../components/layouts/HeaderHome';

export const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
    
  

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:pt-40 lg:pb-24 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-80" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Our Story and{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Mission
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Founded with the vision to transform how teams collaborate and achieve their goals.
            </p>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The ProjectHub Story</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  ProjectHub was born in 2022 when our founders, experienced project managers themselves, recognized a fundamental gap in existing project management tools. While many solutions offered robust features, they often created more complexity than clarity.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Our mission became clear: to create a platform that combines powerful functionality with intuitive design, enabling teams to focus on executing great work rather than managing tools.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, ProjectHub serves thousands of teams across 50+ countries, from startups to Fortune 500 companies, all unified by the desire to work smarter and achieve more together.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-indigo-600 w-full h-full flex items-center justify-center p-8">
                  <p className="text-4xl text-white font-bold text-center">Our team has over 30 years of combined experience in project management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-b from-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at ProjectHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Simplicity",
                description: "We believe the most powerful solutions are often the simplest. We constantly strive to reduce complexity and focus on what truly matters."
              },
              {
                title: "Collaboration",
                description: "Great achievements come from teamwork. We design our tools to foster communication, cooperation, and collective problem-solving."
              },
              {
                title: "Adaptability",
                description: "Every team is unique. Our platform is built to be flexible enough to adapt to diverse workflows and evolving needs."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-8">
                <h3 className="text-xl font-bold text-indigo-600 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to helping teams thrive
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: "Alex Morgan",
                role: "CEO & Co-Founder",
                bio: "Former project manager with 10+ years of experience leading cross-functional teams at tech giants.",
                initials: "AM",
                color: "bg-indigo-100 text-indigo-600"
              },
              {
                name: "Sarah Chen",
                role: "CTO & Co-Founder",
                bio: "Engineering leader specializing in scalable cloud architecture and collaborative software development.",
                initials: "SC",
                color: "bg-purple-100 text-purple-600"
              },
              {
                name: "Marcus Johnson",
                role: "Head of Product",
                bio: "UX enthusiast focused on creating intuitive interfaces that maximize team productivity and engagement.",
                initials: "MJ",
                color: "bg-blue-100 text-blue-600"
              }
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full ${member.color} flex items-center justify-center mb-6`}>
                  <span className="text-2xl font-bold">{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#8b5cf6_0%,_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#6366f1_0%,_transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your team's workflow?</h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of teams already achieving more with ProjectHub
            </p>
            <Link
              to="/auth?signup=true"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-lg inline-block"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
    
    </div>
  );
};