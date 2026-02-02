import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { format, subDays, isAfter } from 'date-fns';
import { TrendingUp, Activity } from 'lucide-react';
import { VitalSigns } from '@/types/clinical.types';
import { cn } from '@/lib/utils';

interface VitalsTrendChartProps {
  vitals: VitalSigns[];
  patientId: string;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export function VitalsTrendChart({ vitals, patientId }: VitalsTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const filteredVitals = useMemo(() => {
    const patientVitals = vitals.filter(v => v.patientId === patientId);
    
    if (timeRange === 'all') {
      return patientVitals;
    }

    const daysMap: Record<TimeRange, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'all': 0,
    };

    const cutoffDate = subDays(new Date(), daysMap[timeRange]);
    return patientVitals.filter(v => isAfter(new Date(v.recordedAt), cutoffDate));
  }, [vitals, patientId, timeRange]);

  const chartData = useMemo(() => {
    return filteredVitals
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
      .map(v => ({
        date: format(new Date(v.recordedAt), 'dd MMM'),
        fullDate: format(new Date(v.recordedAt), 'dd MMM yyyy, hh:mm a'),
        systolic: v.bloodPressureSystolic,
        diastolic: v.bloodPressureDiastolic,
        pulse: v.pulse,
      }));
  }, [filteredVitals]);

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
  ];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Blood Pressure Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Not enough data to show trends</p>
            <p className="text-xs">Record more vitals to see trends over time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Blood Pressure Trend
        </CardTitle>
        <div className="flex gap-1">
          {timeRangeButtons.map(({ value, label }) => (
            <Button
              key={value}
              variant={timeRange === value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(value)}
              className="text-xs h-7"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Systolic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Diastolic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Pulse</span>
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[40, 180]}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullDate;
                  }
                  return '';
                }}
              />
              
              {/* Normal BP reference lines */}
              <ReferenceLine 
                y={120} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={80} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              
              {/* Data lines */}
              <Line
                type="monotone"
                dataKey="systolic"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
                name="Systolic"
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                stroke="hsl(215 91% 59%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(215 91% 59%)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
                name="Diastolic"
              />
              <Line
                type="monotone"
                dataKey="pulse"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(142 76% 36%)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
                name="Pulse"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reference info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">
            Normal BP: 120/80 mmHg
          </Badge>
          <span>•</span>
          <span>{chartData.length} readings</span>
        </div>
      </CardContent>
    </Card>
  );
}
