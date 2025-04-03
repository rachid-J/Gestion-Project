import { Link } from 'react-router-dom';
import { ChartBarIcon, UserGroupIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import dashboardImage from "../assets/dashboard.png";

export const LandingPage = () => {
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
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
                ProjectHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">Pricing</a>
            
              <Link 
                to="/auth" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-white font-semibold text-lg mb-4">ProjectHub</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Empowering teams to achieve more through intelligent project management solutions.
              </p>
              <div className="mt-6 flex items-center space-x-4">
  {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map((social) => (
    <a 
      href="#" 
      key={social} 
      className="text-gray-400 hover:text-indigo-600 transition-colors"
    >
      <span className="sr-only">{social}</span>
      {social === 'Twitter' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ) : social === 'LinkedIn' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ) : social === 'GitHub' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      )}
    </a>
  ))}
</div>
            </div>
            {[
              {
                title: 'Product',
                links: ['Features', 'Integrations', 'Pricing', 'Changelog']
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Guides', 'API Reference', 'Blog']
              },
              {
                title: 'Company',
                links: ['About', 'Customers', 'Careers', 'Contact']
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Security', 'Compliance']
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="text-white font-medium mb-4">{column.title}</h4>
                <ul className="space-y-3 text-sm">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};