import React from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  "CTPS",
  "PDS",
  "DBMS",
  "JAVA",
  "PYTHON",
  "OOPS",
  "PLACEMENT PROGRAMMING",
  "LEVEL 1",
  "LEVEL 2",
  "LEVEL 3",
  "LEVEL 4",
  "LEVEL 5",
  "LEVEL 6",
  "LEVEL 7",
  "LEVEL 8",
  "LEVEL 9",
  "LEVEL 10",
];

const Courses = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">
          Click a subject to start studying!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject}
            className="cursor-pointer glass-card p-8 rounded-xl flex items-center justify-center text-xl font-semibold text-purple bg-white/80 hover:bg-purple/10 transition-colors shadow-lg min-h-[120px]"
            onClick={() => navigate(`/dashboard/courses/${encodeURIComponent(subject.toLowerCase().replace(/\s+/g, '-'))}`)}
          >
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses; 