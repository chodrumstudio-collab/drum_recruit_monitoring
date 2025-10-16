import { Clock } from 'lucide-react';
import { Card } from './ui/card';

interface Activity {
  id: string;
  site: string;
  time: string;
  title: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className="p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 lg:mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">최근 활동</h3>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {index < activities.length - 1 && (
              <div className="absolute left-[7px] top-6 w-[2px] h-[calc(100%+12px)] lg:h-[calc(100%+16px)] bg-gray-200" />
            )}
            <div className="flex gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-600 mt-0.5 relative z-10 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-xs lg:text-sm line-clamp-2 mb-1">
                  {activity.title}
                </div>
                <div className="text-gray-500 text-xs mb-1">{activity.site}</div>
                <div className="text-gray-400 text-xs">{activity.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
