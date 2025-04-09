import { Link } from 'react-router-dom';
import { ChartBarIcon, UserGroupIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import dashboardImage from "../assets/dashboard.png";
import { HeaderHome } from '../components/layouts/HeaderHome';

export const LandingPage = () => {
 

  const testimonials = [
    {
      quote: "ProjectHub transformed how our engineering team collaborates. We've doubled our productivity while reducing meeting time by 40%.",
      name: "Sarah Johnson",
      title: "CTO at TechCorp",
      initials: "SJ",
      color: "indigo"
    },
    {
      quote: "The analytics features have given us unprecedented visibility into our project bottlenecks, helping us optimize our workflow.",
      name: "Michael Chen",
      title: "Product Director at InnovateCo",
      initials: "MC",
      color: "purple"
    },
    {
      quote: "After implementing ProjectHub, our team's on-time delivery rate improved from 65% to over 90% in just three months.",
      name: "Alicia Rodriguez",
      title: "VP of Operations at Nexus",
      initials: "AR",
      color: "blue"
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <HeaderHome/>

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:pt-44 lg:pb-36 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-80" />
        <div className="absolute right-0 top-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Elevate Your Team's{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              The comprehensive project management platform that helps teams organize work, 
              streamline communication, and deliver results faster.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth?signup=true"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Start Free Trial
              </Link>
            
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 mx-auto max-w-6xl">
            <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fff_0%,_transparent_60%)]" />
              <img 
                src={dashboardImage}
                alt="Dashboard Preview" 
                className="relative w-full h-auto rounded-3xl transform transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
            </div>
          </div>
          
          {/* Integration Logos */}
          <div className="mt-20 text-center">
            <p className="text-sm font-medium text-gray-500 mb-6">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-70">
              {['Microsoft', 'Adobe', 'Shopify', 'Spotify', 'Airbnb'].map((company) => (
                <div key={company} className="text-gray-400 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      
      {/* Statistics Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '40%', label: 'Increase in team productivity' },
              { number: '10,000+', label: 'Teams using ProjectHub daily' },
              { number: '99.9%', label: 'Uptime reliability' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-8">
                <p className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">See how organizations are transforming their workflows with ProjectHub</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 border rounded-2xl hover:border-indigo-200 transition-colors bg-white hover:shadow-md"
              >
                <div className="text-indigo-600 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 7L8 11H11V17H5V11L7 7H10M18 7L16 11H19V17H13V11L15 7H18Z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${testimonial.color}-100 flex items-center justify-center`}>
                    <span className={`text-${testimonial.color}-600 font-medium`}>{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full mb-4">PRICING</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$29',
                period: 'per month',
                description: 'Perfect for small teams getting started',
                features: ['Up to 5 team members', '10 projects', 'Basic analytics', 'Email support'],
                cta: 'Start Free Trial',
                highlight: false
              },
              {
                name: 'Professional',
                price: '$79',
                period: 'per month',
                description: 'Everything you need for growing teams',
                features: ['Up to 20 team members', 'Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom integrations'],
                cta: 'Start Free Trial',
                highlight: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For organizations with advanced needs',
                features: ['Unlimited team members', 'Dedicated account manager', 'Custom security controls', 'SLA guarantees', 'On-premise options'],
                cta: 'Contact Sales',
                highlight: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-2xl border ${plan.highlight ? 'border-indigo-200 shadow-lg ring-1 ring-indigo-200' : 'border-gray-200'} bg-white relative`}
              >
                {plan.highlight && (
                  <span className="absolute top-0 transform -translate-y-1/2 right-8 px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-2">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/auth?signup=true'}
                  className={`w-full text-center py-3 rounded-xl font-medium transition-all ${
                    plan.highlight 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-md'
                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#8b5cf6_0%,_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#6366f1_0%,_transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join 10,000+ teams already achieving more with ProjectHub
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/auth?signup=true"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-lg"
              >
                Start Free Trial
              </Link>
           
            </div>
          </div>
        </div>
      </div>

    
      
    </div>
  );
};