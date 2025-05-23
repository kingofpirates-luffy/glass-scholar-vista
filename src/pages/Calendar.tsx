import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, CheckCircle, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Dummy test data
const dummyTests = [
  {
    date: new Date(new Date().setDate(5)),
    subject: "DBMS",
    name: "Unit Test 1",
    status: "To Evaluate",
  },
  {
    date: new Date(new Date().setDate(12)),
    subject: "JAVA",
    name: "Quiz",
    status: "Evaluated",
  },
  {
    date: new Date(new Date().setDate(18)),
    subject: "CTPS",
    name: "Assignment",
    status: "To Evaluate",
  },
  {
    date: new Date(new Date().setDate(25)),
    subject: "PYTHON",
    name: "Lab Test",
    status: "Evaluated",
  },
];

const getStatusColor = (status: string) => {
  if (status === "To Evaluate") return "bg-amber-100 text-amber-800";
  if (status === "Evaluated") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleCreateTest = () => {
    toast({ title: "Test creation modal coming soon! (This is a dummy button)" });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-purple" />
          <div>
            <h1 className="text-3xl font-bold">Academic Planner</h1>
            <p className="text-muted-foreground">Plan, create, and evaluate tests with ease.</p>
          </div>
        </div>
        <Button className="bg-purple hover:bg-purple-dark text-white rounded-full px-6 py-3 shadow-lg" onClick={handleCreateTest}>
          <Plus className="h-5 w-5 mr-2" /> Create Test
        </Button>
      </div>
      <Card className="glass-card p-6 rounded-3xl shadow-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setCurrentMonth(addDays(monthStart, -1 * 30))}>&lt;</Button>
            <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="ghost" onClick={() => setCurrentMonth(addDays(monthStart, 31))}>&gt;</Button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-purple mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {days.map((date, idx) => {
              const test = dummyTests.find((t) => isSameDay(t.date, date) && isSameMonth(date, monthStart));
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-start min-h-[80px] rounded-xl p-2 transition-all ${
                    isSameMonth(date, monthStart)
                      ? "bg-white/60 hover:bg-purple/10 shadow-md"
                      : "bg-gray-100/40 text-gray-400"
                  }`}
                  style={{ border: isSameDay(date, new Date()) ? '2px solid #a78bfa' : undefined }}
                >
                  <span className="font-semibold mb-1">{format(date, "d")}</span>
                  {test && (
                    <div className={`w-full mt-1 rounded-lg px-2 py-1 text-xs font-semibold ${getStatusColor(test.status)} flex flex-col items-center glass-card shadow`}>
                      <span className="truncate w-full">{test.subject}</span>
                      <span className="truncate w-full text-[11px] font-normal">{test.name}</span>
                      <span className="flex items-center gap-1 mt-1">
                        {test.status === "To Evaluate" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {test.status}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage; 