import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MonitoringSidebar } from './components/MonitoringSidebar';
import { FilterBar } from './components/FilterBar';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { EmptyState } from './components/EmptyState';
import { ScrollArea } from './components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Pagination } from './components/Pagination';

// Mock data
const initialSites = [
  { 
    id: 'mulkorea', 
    name: '뮬코리아 (교회 멤버 구인)', 
    enabled: true, 
    newCount: 3,
    url: 'https://www.mule.co.kr/bbs/info/recruit?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8&ct1=&ct2=&ct3=&store=&options=&soldout=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and&v=l'
  },
  { 
    id: 'lessoninfo-drummer', 
    name: '레슨인포 - 드러머', 
    enabled: true, 
    newCount: 2,
    url: 'https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=%EB%93%9C%EB%9F%AC%EB%A8%B8'
  },
  { 
    id: 'lessoninfo-drum', 
    name: '레슨인포 - 드럼', 
    enabled: true, 
    newCount: 1,
    url: 'https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=%EB%93%9C%EB%9F%BC'
  },
  { 
    id: 'godpeople', 
    name: '갓피플 구인구직', 
    enabled: true, 
    newCount: 0,
    url: 'https://recruit.godpeople.com/?GO=recruit_find&rc_tab=2'
  },
  { 
    id: 'jangshin', 
    name: '장신대 - 드럼', 
    enabled: true, 
    newCount: 1,
    url: 'https://www.puts.ac.kr/www/board/list.general.asp?skin=&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=%B5%E5%B7%B3'
  },
  { 
    id: 'jangshin-drummer', 
    name: '장신대 - 드러머', 
    enabled: true, 
    newCount: 1,
    url: 'https://www.puts.ac.kr/www/board/list.general.asp?skin=type2&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=%B5%E5%B7%AF%B8%D3'
  },
];

const mockPosts = [
  {
    id: '1',
    title: '서울 강남 교회 드럼 주자 구합니다',
    site: '뮬코리아 (교회 멤버 구인)',
    siteId: 'mulkorea',
    date: '2025-10-16 14:30',
    preview: '주일 예배 및 수요예배 드럼 연주자를 찾습니다. 경력 2년 이상 우대하며, 찬양에 대한 열정이 있으신 분을 환영합니다.',
    isNew: true,
    url: 'https://www.mule.co.kr/bbs/info/recruit?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8&ct1=&ct2=&ct3=&store=&options=&soldout=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and&v=l',
    author: '뮬지기3',
    views: '11,191'
  },
  {
    id: '2',
    title: '드럼 레슨 강사 모집 (분당)',
    site: '레슨인포 - 드러머',
    siteId: 'lessoninfo-drummer',
    date: '2025-10-16 13:45',
    preview: '분당 소재 음악학원에서 드럼 레슨 강사를 모집합니다. 주말 레슨 가능하신 분 우대합니다.',
    isNew: true,
    url: 'https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=%EB%93%9C%EB%9F%AC%EB%A8%B8',
  },
  {
    id: '3',
    title: '교회 세션 드러머 상시 모집',
    site: '뮬코리아 (교회 멤버 구인)',
    siteId: 'mulkorea',
    date: '2025-10-16 12:20',
    preview: '인천 지역 교회에서 정기적으로 찬양 세션에 참여하실 드러머를 찾습니다. 주일 오전 예배 참석 필수입니다.',
    isNew: true,
    url: 'https://www.mule.co.kr/bbs/info/recruit?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8&ct1=&ct2=&ct3=&store=&options=&soldout=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and&v=l',
  },
  {
    id: '4',
    title: '밴드 드러머 급구 (록/메탈)',
    site: '레슨인포 - 드럼',
    siteId: 'lessoninfo-drum',
    date: '2025-10-16 11:15',
    preview: '홍대 지역에서 활동 중인 록 밴드입니다. 더블베이스 가능하신 드러머 분을 찾습니다. 정기 공연 예정입니다.',
    isNew: true,
    url: 'https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=%EB%93%9C%EB%9F%BC',
  },
  {
    id: '5',
    title: '[급구] 결혼식 연주 드러머',
    site: '뮬코리아 (교회 멤버 구인)',
    siteId: 'mulkorea',
    date: '2025-10-16 10:30',
    preview: '11월 2일 토요일 결혼식 연주를 도와주실 드러머를 찾습니다. 페이 있습니다.',
    isNew: true,
    url: 'https://www.mule.co.kr/bbs/info/recruit?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8&ct1=&ct2=&ct3=&store=&options=&soldout=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and&v=l',
  },
  {
    id: '6',
    title: '신학대 찬양팀 드럼 주자 모집',
    site: '장신대 - 드럼',
    siteId: 'jangshin',
    date: '2025-10-16 09:50',
    preview: '장로회신학대학교 찬양팀에서 드럼 연주자를 모집합니다. 학생 및 졸업생 환영합니다.',
    isNew: true,
    url: 'https://www.puts.ac.kr/www/board/list.general.asp?skin=&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=%B5%E5%B7%B3',
  },
  {
    id: '7',
    title: '드럼 개인 레슨 선생님 구합니다',
    site: '레슨인포 - 드러머',
    siteId: 'lessoninfo-drummer',
    date: '2025-10-16 09:10',
    preview: '성인 취미반 드럼 레슨을 진행해주실 선생님을 찾습니다. 왕초보도 환영합니다.',
    isNew: true,
    url: 'https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=%EB%93%9C%EB%9F%AC%EB%A8%B8',
  },
  {
    id: '8',
    title: '장신대 졸업생 드러머 모집',
    site: '장신대 - 드러머',
    siteId: 'jangshin-drummer',
    date: '2025-10-16 08:45',
    preview: '장로회신학대학교 동문회 행사에서 연주하실 드러머를 찾습니다. 졸업생 우선입니다.',
    isNew: true,
    url: 'https://www.puts.ac.kr/www/board/list.general.asp?skin=type2&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=%B5%E5%B7%AF%B8%D3',
  },
];


export default function App() {
  const [sites, setSites] = useState(initialSites);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });

  // 실제 데이터 가져오기 함수
  const fetchRealData = async (page = 1, site = 'all') => {
    setIsLoading(true);
    try {
      const url = new URL('http://localhost:3001/api/posts');
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '10');
      url.searchParams.set('site', site);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 타임아웃 설정 (5초)
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('실제 데이터를 성공적으로 가져왔습니다.');
          setPosts(data.data);
          setPagination(data.pagination);
          setLastUpdate(new Date());
        } else {
          throw new Error('서버에서 데이터를 가져올 수 없습니다.');
        }
      } else {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
    } catch (error) {
      console.log('서버 연결 실패, 모의 데이터를 사용합니다.');
      // 에러 시 모의 데이터 사용
      setPosts(mockPosts);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalPosts: mockPosts.length,
        limit: 10,
        hasNext: false,
        hasPrev: false
      });
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchRealData(currentPage, selectedSite);
    
    // 5분마다 자동 업데이트
    const interval = setInterval(() => fetchRealData(currentPage, selectedSite), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentPage, selectedSite]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRealData(page, selectedSite);
  };

  // 사이트 변경 핸들러
  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
    setCurrentPage(1);
    fetchRealData(1, site);
  };

  // 게시글 상세보기 핸들러
  const handleViewDetail = (post: any) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  // Filter posts based on search
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.preview && post.preview.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        onRefresh={fetchRealData}
        isLoading={isLoading}
        lastUpdate={lastUpdate}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <MonitoringSidebar sites={sites} />
        </div>
        
        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle>모니터링 사이트</SheetTitle>
            </SheetHeader>
            <MonitoringSidebar sites={sites} />
          </SheetContent>
        </Sheet>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSite={selectedSite}
            onSiteChange={handleSiteChange}
          />
          
          <ScrollArea className="flex-1">
            <div className="p-4 lg:p-6">
              {filteredPosts.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="space-y-4 max-w-4xl">
                    {filteredPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        {...post} 
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                  </div>
                  
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                  />
                </>
              )}
            </div>
            
          </ScrollArea>
        </main>
        
        {/* 게시글 상세 모달 */}
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          post={selectedPost}
        />
      </div>
    </div>
  );
}
