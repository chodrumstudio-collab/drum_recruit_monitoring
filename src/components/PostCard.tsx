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
  onViewDetail?: (post: PostCardProps) => void;
}

export function PostCard({ id, title, site, siteId, date, preview, isNew, url, author, views, onViewDetail }: PostCardProps) {
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
            <span className="text-gray-400 text-xs">{date}</span>
            {author && (
              <span className="text-gray-500 text-xs">작성자: {author}</span>
            )}
            {views && (
              <span className="text-gray-500 text-xs">조회: {views}</span>
            )}
          </div>
          <div className="flex gap-2">
            {onViewDetail && (
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 flex-shrink-0"
                onClick={() => onViewDetail({ id, title, site, siteId, date, preview, isNew, url, author, views })}
              >
                상세보기
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 flex-shrink-0"
              onClick={() => window.open(url, '_blank')}
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
