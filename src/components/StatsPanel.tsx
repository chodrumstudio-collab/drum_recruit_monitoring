import { TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface StatItem {
  site: string;
  count: number;
  color: string;
}

interface StatsPanelProps {
  totalToday: number;
  statsBySite: StatItem[];
}

export function StatsPanel({ totalToday, statsBySite }: StatsPanelProps) {
  const maxCount = Math.max(...statsBySite.map(s => s.count), 1);
  
  return (
    <Card className="p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 lg:mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">오늘의 통계</h3>
      </div>
      
      <div className="mb-4 lg:mb-6">
        <div className="text-3xl lg:text-4xl text-blue-600 mb-1">{totalToday}</div>
        <div className="text-gray-500 text-sm">새로운 게시글</div>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        <div className="text-gray-700 text-sm mb-2 lg:mb-3">사이트별 게시글</div>
        {statsBySite.map((stat) => (
          <div key={stat.site} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 text-xs lg:text-sm truncate flex-1">{stat.site}</span>
              <span className="text-gray-900 ml-2">{stat.count}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${(stat.count / maxCount) * 100}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
