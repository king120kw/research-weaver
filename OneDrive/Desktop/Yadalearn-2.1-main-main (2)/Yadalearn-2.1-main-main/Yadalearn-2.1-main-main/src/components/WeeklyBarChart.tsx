import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import type { WeeklyScheduleDay } from '@/types/schema';
import { formatHourLabel } from '@/utils/formatters';

interface WeeklyBarChartProps {
  data: WeeklyScheduleDay[];
  totalHours: number;
  totalMinutes: number;
}

export const WeeklyBarChart = ({ data, totalHours, totalMinutes }: WeeklyBarChartProps) => {
  const highestDay = data.find(d => d.isHighest);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      {/* Header Card */}
      <div className="gradient-yellow-card rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
              <span className="text-xl">⏰</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Details</span>
          </div>
          <button className="text-sm font-medium text-gray-700 flex items-center gap-1">
            →
          </button>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">
          {totalHours.toString().padStart(2, '0')} Hr {totalMinutes.toString().padStart(2, '0')}mins
        </h3>
        <p className="text-sm text-gray-600">Highest</p>
        <p className="text-sm text-gray-600">Practicing Score</p>
        {highestDay && (
          <div className="mt-3 inline-block bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {formatHourLabel(highestDay.hours)}
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isHighest ? '#C9B4E8' : '#1A1A1A'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};