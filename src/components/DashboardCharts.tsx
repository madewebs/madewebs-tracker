'use client';

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 18998, profit: 11798 },
  { month: "Feb", revenue: 24997, profit: 15897 },
  { month: "Mar", revenue: 12999, profit: 7599 },
  { month: "Apr", revenue: 34996, profit: 22196 },
  { month: "May", revenue: 21998, profit: 13698 },
  { month: "Jun", revenue: 28997, profit: 18797 },
];

export function DashboardCharts({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-[14px] p-5">
        <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-4">Monthly Revenue</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#078FCD" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#078FCD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
              <Tooltip formatter={(v: any) => "₹" + Number(v || 0).toLocaleString("en-IN")} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="#078FCD" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[14px] p-5">
        <h3 className="text-[15px] font-bold text-gray-900 m-0 mb-4">Monthly Profit</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
              <Tooltip formatter={(v: any) => "₹" + Number(v || 0).toLocaleString("en-IN")} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
