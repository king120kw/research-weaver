import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor: string;
  iconBgColor: string;
}

export const StatCard = ({ icon: Icon, label, value, iconColor, iconBgColor }: StatCardProps) => {
  return (
    <Card className="glass-card border-white/40 hover:bg-white/80 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full ${iconBgColor} p-2`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};