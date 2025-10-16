import { X, ExternalLink, Calendar, User, Eye, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    title: string;
    site: string;
    siteId: string;
    date: string;
    preview: string;
    url: string;
    author?: string;
    views?: string;
  } | null;
}

export function PostDetailModal({ isOpen, onClose, post }: PostDetailModalProps) {
  if (!post) return null;

  const handleExternalLink = () => {
    window.open(post.url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900 pr-8">
            {post.title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 사이트 정보 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span className="font-medium">{post.site}</span>
          </div>
          
          {/* 게시글 내용 */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">게시글 내용</h3>
              <p className="text-gray-700 leading-relaxed">
                {post.preview}
              </p>
            </div>
          </div>
          
          {/* 메타 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            
            {post.views && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>조회 {post.views}</span>
              </div>
            )}
          </div>
          
          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={handleExternalLink}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              원본 사이트에서 보기
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
