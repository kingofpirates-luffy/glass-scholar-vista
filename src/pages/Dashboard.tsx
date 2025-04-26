
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Award, Clock, Calendar } from "lucide-react";

// Sample data for charts
const performanceData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 59 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 81 },
  { month: "May", score: 76 },
  { month: "Jun", score: 85 },
];

const subjectData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 78 },
  { subject: "History", score: 92 },
  { subject: "English", score: 88 },
  { subject: "CS", score: 95 },
];

const upcomingTasks = [
  { id: 1, title: "Physics Assignment", course: "Physics 101", due: "Today" },
  { id: 2, title: "Math Quiz", course: "Calculus II", due: "Tomorrow" },
  { id: 3, title: "Literature Essay", course: "English Lit", due: "2 days" },
];

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Jane! Here's an overview of your academic performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="GPA"
          value="3.8/4.0"
          description="Current semester"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
        />
        <StatsCard 
          title="Attendance"
          value="95%"
          description="Last 30 days"
          icon={<Calendar className="h-5 w-5" />}
          trend="up"
        />
        <StatsCard 
          title="Complete Tasks"
          value="24/30"
          description="This month"
          icon={<Award className="h-5 w-5" />}
          trend="neutral"
        />
        <StatsCard 
          title="Study Time"
          value="32h"
          description="This week"
          icon={<Clock className="h-5 w-5" />}
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#8E9196" />
                  <YAxis stroke="#8E9196" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none'
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#9b87f5" fill="#9b87f550" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="subject" stroke="#8E9196" />
                  <YAxis stroke="#8E9196" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="score" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/20 border border-white/30"
              >
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm px-2 py-1 rounded-full",
                    task.due === "Today" 
                      ? "bg-red-100 text-red-800" 
                      : task.due === "Tomorrow" 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-green-100 text-green-800"
                  )}>
                    {task.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple/10 p-2.5 rounded-md">
            {icon}
          </div>
          {trend === "up" && (
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+4.5%</div>
          )}
          {trend === "down" && (
            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">-2.3%</div>
          )}
        </div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// Helper function for conditionally joining classNames
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
