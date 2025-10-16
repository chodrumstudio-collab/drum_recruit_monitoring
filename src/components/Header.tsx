import { Menu, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  lastUpdate?: Date;
}

export function Header({ onMenuClick, onRefresh, isLoading, lastUpdate }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-blue-600 text-base lg:text-xl">드럼 리크루팅 모니터 시스템</h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          </div>
          <span className="text-gray-700 text-sm">
            {isLoading ? '데이터 수집 중...' : '모의 데이터 사용 중'}
          </span>
          {lastUpdate && (
            <span className="text-gray-500 text-xs">
              마지막 업데이트: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefresh}
            disabled={isLoading}
            className="hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
        
      </div>
    </header>
  );
}
