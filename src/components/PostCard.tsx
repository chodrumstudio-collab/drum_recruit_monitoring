import { ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PostCardProps {
  id: string;
  title: string;
  site: string;
  siteId: string;
  date: string;
  preview?: string;
  isNew?: boolean;
  url: string;
  author?: string;
  views?: string;
}

export function PostCard({ id, title, site, siteId, date, preview, isNew, url, author, views }: PostCardProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return '어제';
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else if (diffDays < 30) {
        return `${Math.ceil(diffDays / 7)}주 전`;
      } else if (diffDays < 365) {
        return `${Math.ceil(diffDays / 30)}개월 전`;
      } else {
        return date.toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="p-4 lg:p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 flex-wrap">
          {isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 flex-shrink-0">
              NEW
            </Badge>
          )}
          <span className="text-gray-500 text-xs lg:text-sm">{site}</span>
        </div>
        
        <h3 className="text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-1 line-clamp-2">
          {preview}
        </p>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs" title={date}>
              {formatDate(date)}
            </span>
            {author && (
              <span className="text-gray-500 text-xs">작성자: {author}</span>
            )}
            {views && (
              <span className="text-gray-500 text-xs">조회: {views}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 flex-shrink-0"
              onClick={() => window.open(url, '_blank')}
              aria-label={`${title} 원본 사이트로 이동`}
            >
              바로가기
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
