import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useEffect, useRef } from 'react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSite: string;
  onSiteChange: (value: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedSite,
  onSiteChange,
}: FilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    
    if (!container) return;

    // 초기 스크롤 위치를 0으로 설정 (전체 탭부터 보이게)
    container.scrollLeft = 0;
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        {/* 검색 */}
        <div className="flex flex-col sm:flex-row gap-3 lg:items-center lg:gap-4">
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* 사이트 탭 */}
        <div ref={scrollContainerRef} className="w-full overflow-x-auto scrollbar-hide tabs-container">
          <Tabs value={selectedSite} onValueChange={onSiteChange} className="w-full">
            <TabsList className="flex w-max gap-1 h-auto p-1 bg-white rounded-lg justify-start">
              <TabsTrigger value="all" className="text-sm px-4 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit bg-white">
                전체
              </TabsTrigger>
              <TabsTrigger value="mulkorea" className="text-sm px-3 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit bg-white">
                뮬코리아
              </TabsTrigger>
              <TabsTrigger value="lessoninfo-drummer" className="text-sm px-3 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit bg-white">
                레슨인포-드러머
              </TabsTrigger>
              <TabsTrigger value="lessoninfo-drum" className="text-sm px-3 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit bg-white">
                레슨인포-드럼
              </TabsTrigger>
              <TabsTrigger value="godpeople" className="text-sm px-3 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit bg-white">
                갓피플
              </TabsTrigger>
              <TabsTrigger value="jangshin" className="text-sm px-3 py-2 h-auto whitespace-nowrap flex-shrink-0 min-w-fit">
                장신대
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
