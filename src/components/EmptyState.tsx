import { Music2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20 px-4 lg:px-6">
      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 lg:mb-6">
        <Music2 className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
      </div>
      
      <h3 className="text-gray-900 mb-2 text-center">
        아직 새로운 게시글이 없습니다
      </h3>
      
      <p className="text-gray-500 text-sm text-center max-w-sm px-4">
        모니터링이 활성화되면 자동으로 표시됩니다
      </p>
    </div>
  );
}
