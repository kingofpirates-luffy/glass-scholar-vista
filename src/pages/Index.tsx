
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { MessagesSquare, TrendingUp, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-neutral-light">
      <Navigation transparent />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Track Your Academic Progress with
              <span className="bg-gradient-to-r from-purple to-skyblue bg-clip-text text-transparent"> ScholarVista</span>
            </h1>
            <p className="text-lg text-foreground/70 mb-8 max-w-lg">
              The elegant, powerful dashboard that helps students visualize performance, set goals, and get AI-powered assistance in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button className="bg-purple hover:bg-purple-dark text-white px-8 py-6 rounded-full">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="glass-button px-8 py-6 rounded-full">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="glass-card p-4 rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000" 
                alt="Dashboard Preview" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-purple/10 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
            <p className="text-foreground/70">
              Visualize your academic progress with beautiful charts and actionable insights to improve your grades.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-purple/10 p-3 rounded-lg w-fit mb-4">
              <MessagesSquare className="h-6 w-6 text-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Study Assistant</h3>
            <p className="text-foreground/70">
              Get personalized help with your studies through our intelligent chatbot that remembers your conversations.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="bg-purple/10 p-3 rounded-lg w-fit mb-4">
              <BookOpen className="h-6 w-6 text-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Course Management</h3>
            <p className="text-foreground/70">
              Organize your classes, assignments, and exams in one beautiful interface to stay on top of your studies.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass-dialog p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Academic Performance?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-lg mx-auto">
              Join thousands of students who have improved their grades with ScholarVista.
            </p>
            <Link to="/login">
              <Button className="bg-purple hover:bg-purple-dark text-white px-8 py-6 rounded-full">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="container mx-auto text-center text-foreground/60 text-sm">
          <p>© 2025 ScholarVista. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
