"use client";

import { CalendarLume } from "@/components/ui/calendar-lume";

export default function CalendarDemoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-cover bg-center p-6" style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1673873438024-81d29f555b95?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjM2fHxjb2xvcnxlbnwwfHwwfHx8MA%3D%3D')` }}>
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-center mb-6 text-white drop-shadow-md">
          Better Calendar Demo
        </h1>
        <CalendarLume />
      </div>
    </div>
  );
}
