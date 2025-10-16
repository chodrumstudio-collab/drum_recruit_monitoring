import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface MonitoringSite {
  id: string;
  name: string;
  enabled: boolean;
  newCount: number;
  url?: string;
}

interface MonitoringSidebarProps {
  sites: MonitoringSite[];
}

export function MonitoringSidebar({ sites }: MonitoringSidebarProps) {
  return (
    <aside className="w-full lg:w-[280px] bg-white lg:border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 flex-1">
        <h2 className="text-gray-900 mb-4 hidden lg:block">모니터링 사이트</h2>
        
        <div className="space-y-3">
          {sites.map((site) => (
            <div
              key={site.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 text-sm truncate block">{site.name}</span>
                  {site.url && (
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 truncate block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      사이트 방문 →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="p-6">
        <Button variant="outline" className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          알림 설정
        </Button>
      </div>
    </aside>
  );
}
