import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Container from '../components/container';
import AuctionsSlider from '../components/AuctionsSlider';
import { Plus, Minus, Shield, Award, Users, Clock, Star, Globe, Lightbulb, Gift } from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />, 
      title: "Real-time Bidding", 
      description: "Experience the thrill of live auctions with real-time updates and instant notifications."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />, 
      title: "Secure Transactions", 
      description: "Your payments and personal information are protected with bank-level security."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />, 
      title: "Verified Sellers", 
      description: "All our sellers go through a strict verification process to ensure quality."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />, 
      title: "Active Community", 
      description: "Join thousands of collectors and enthusiasts in our growing community."
    }
  ];
  
  const advantages = [
    {
      icon: <Star className="h-8 w-8 text-purple-600" />, 
      title: "Premium Features", 
      description: "Access advanced tools and analytics to boost your sales performance."
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />, 
      title: "Global Reach", 
      description: "Connect with buyers and sellers from around the world."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />, 
      title: "Smart Solutions", 
      description: "Innovative features to streamline your selling process."
    },
    {
      icon: <Gift className="h-8 w-8 text-purple-600" />, 
      title: "Exclusive Benefits", 
      description: "Enjoy special perks and rewards as a verified seller."
    }
  ];
  
  const faqs = [
    {
      question: "How do I start bidding?",
      answer: "Simply create an account, verify your email, and you can start bidding on any active auction."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use industry-standard encryption and secure payment processors to protect your transactions."
    },
    {
      question: "What happens if I win an auction?",
      answer: "You'll receive an email notification with payment instructions and shipping details."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /><br/><br/>
      <Carousel />

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AuctionsSlider />
      <Container/>
       {/* Advantages Section */}
       <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Our Advantages</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover why thousands of sellers choose our platform for their business growth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 flex-grow">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-purple-600" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
