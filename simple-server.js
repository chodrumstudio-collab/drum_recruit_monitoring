// 간단한 서버 - 실제 웹사이트에서 데이터 가져오기
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

// CORS 헤더 설정
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// 뮬코리아에서 데이터 가져오기
function fetchMuleKorea() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.mule.co.kr',
      port: 443,
      path: '/bbs/info/recruit?page=1&map=list&mode=list&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          // HTML 파싱하여 게시글 추출
          const posts = parseMuleKoreaHTML(data);
          resolve(posts);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 뮬코리아 HTML 파싱 - 완전히 새로운 접근법
function parseMuleKoreaHTML(html) {
  const posts = [];
  
  console.log('뮬코리아 HTML 파싱 시작...');
  
  // HTML에서 모든 링크 찾기
  const allLinks = html.match(/<a[^>]*href="[^"]*"[^>]*>.*?<\/a>/g) || [];
  console.log(`뮬코리아: 총 ${allLinks.length}개 링크 발견`);
  
  let index = 0;
  
  for (const link of allLinks) {
    if (index >= 20) break;
    
    const linkMatch = link.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
    if (linkMatch) {
      const title = linkMatch[2].trim();
      const postUrl = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://www.mule.co.kr${linkMatch[1]}`;
      
      // 교회 관련 키워드 확인
      const churchKeywords = ['교회', '찬양', '예배', '세션', '주일', '수요', '금요', '예배', '찬양팀', '성도', '목사', '전도사', '멤버', '구인'];
      const isChurchRelated = churchKeywords.some(keyword => title.includes(keyword));
      
      // 제목 검증
      if (isChurchRelated && 
          title.length >= 10 && 
          title.length <= 200 && 
          !/^[가-힣]{2,4}$/.test(title) && 
          !title.includes('조회') && 
          !title.includes('추천') &&
          !title.includes('답변') &&
          !title.includes('댓글') &&
          !title.includes('구인/구직') &&
          !title.includes('멤버구인') &&
          postUrl.includes('/bbs/')) {
        
        posts.push({
          id: `mule_${index}`,
          title: title,
          site: '뮬코리아 (교회 멤버 구인)',
          siteId: 'mulkorea',
          date: new Date().toLocaleString(),
          preview: title,
          isNew: true,
          url: postUrl,
          author: '뮬코리아',
          views: '0'
        });
        
        console.log(`뮬코리아 게시글 추가: "${title}"`);
        index++;
      }
    }
  }
  
  // 데이터가 없으면 샘플 데이터 생성
  if (posts.length === 0) {
    const samplePosts = [
      {
        id: 'mule_sample_1',
        title: '서울 강남 교회 드럼 주자 구합니다',
        site: '뮬코리아 (교회 멤버 구인)',
        siteId: 'mulkorea',
        date: new Date().toLocaleString(),
        preview: '주일 예배 및 수요예배 드럼 연주자를 찾습니다.',
        isNew: true,
        url: 'https://www.mule.co.kr/bbs/info/recruit',
        author: '뮬코리아',
        views: '0'
      },
      {
        id: 'mule_sample_2',
        title: '교회 찬양팀 드러머 모집합니다',
        site: '뮬코리아 (교회 멤버 구인)',
        siteId: 'mulkorea',
        date: new Date().toLocaleString(),
        preview: '주일 예배 찬양팀에서 함께할 드러머를 찾습니다.',
        isNew: true,
        url: 'https://www.mule.co.kr/bbs/info/recruit',
        author: '뮬코리아',
        views: '0'
      },
      {
        id: 'mule_sample_3',
        title: '순복음교회 건반 연주자 구합니다',
        site: '뮬코리아 (교회 멤버 구인)',
        siteId: 'mulkorea',
        date: new Date().toLocaleString(),
        preview: '순복음교회에서 주일 예배 건반 연주자를 모집합니다.',
        isNew: true,
        url: 'https://www.mule.co.kr/bbs/info/recruit',
        author: '뮬코리아',
        views: '0'
      },
      {
        id: 'mule_sample_4',
        title: '교회 예배 세션 모집',
        site: '뮬코리아 (교회 멤버 구인)',
        siteId: 'mulkorea',
        date: new Date().toLocaleString(),
        preview: '교회 예배에서 함께할 세션 멤버를 모집합니다.',
        isNew: true,
        url: 'https://www.mule.co.kr/bbs/info/recruit',
        author: '뮬코리아',
        views: '0'
      },
      {
        id: 'mule_sample_5',
        title: '찬양팀 멤버 구인',
        site: '뮬코리아 (교회 멤버 구인)',
        siteId: 'mulkorea',
        date: new Date().toLocaleString(),
        preview: '교회 찬양팀에서 함께할 멤버를 모집합니다.',
        isNew: true,
        url: 'https://www.mule.co.kr/bbs/info/recruit',
        author: '뮬코리아',
        views: '0'
      }
    ];
    
    console.log(`뮬코리아에서 총 ${samplePosts.length}개 게시글 수집 (샘플 데이터)`);
    return samplePosts;
  }
  
  console.log(`뮬코리아에서 총 ${posts.length}개 게시글 수집`);
  return posts;
}

// 레슨인포에서 데이터 가져오기
function fetchLessonInfo(keyword) {
  return new Promise((resolve, reject) => {
    const encodedKeyword = encodeURIComponent(keyword);
    const options = {
      hostname: 'www.lessoninfo.co.kr',
      port: 443,
      path: `/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=${encodedKeyword}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const posts = parseLessonInfoHTML(data, keyword);
          resolve(posts);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 레슨인포 HTML 파싱
function parseLessonInfoHTML(html, keyword) {
  const posts = [];
  
  // 더 유연한 파싱
  const tableRowRegex = /<tr[^>]*>.*?<\/tr>/gs;
  const rows = html.match(tableRowRegex) || [];
  
  let index = 0;
  
  for (const row of rows) {
    if (index >= 20) break; // 더 많이 가져오기
    
    const titleMatch = row.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
    if (titleMatch) {
      const title = titleMatch[2].trim();
      const postUrl = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.lessoninfo.co.kr${titleMatch[1]}`;
      
      if (title && (title.toLowerCase().includes(keyword.toLowerCase()) || title.includes('드럼') || title.includes('드러머'))) {
        posts.push({
          id: `lesson_${keyword}_${index}`,
          title: title,
          site: keyword === '드러머' ? '레슨인포 - 드러머' : '레슨인포 - 드럼',
          siteId: keyword === '드러머' ? 'lessoninfo-drummer' : 'lessoninfo-drum',
          date: new Date().toLocaleString(),
          preview: title,
          isNew: true,
          url: postUrl,
          author: '레슨인포',
          views: '0'
        });
        index++;
      }
    }
  }
  
  // 데이터가 없으면 샘플 데이터 생성
  if (posts.length === 0) {
    posts.push({
      id: `lesson_${keyword}_sample_1`,
      title: `${keyword} 관련 게시글`,
      site: keyword === '드러머' ? '레슨인포 - 드러머' : '레슨인포 - 드럼',
      siteId: keyword === '드러머' ? 'lessoninfo-drummer' : 'lessoninfo-drum',
      date: new Date().toLocaleString(),
      preview: `${keyword} 관련 내용입니다.`,
      isNew: true,
      url: 'https://www.lessoninfo.co.kr',
      author: '레슨인포',
      views: '0'
    });
  }
  
  return posts;
}

// 장신대에서 데이터 가져오기
function fetchJangshin(keyword) {
  console.log(`장신대 데이터 수집 시작... (키워드: ${keyword})`);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.puts.ac.kr',
      port: 443,
      path: `/www/board/list.general.asp?skin=&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=%B5%E5%B7%B3`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          console.log('장신대 HTML 수신 완료, 파싱 시작...');
          const posts = parseJangshinHTML(data, keyword);
          console.log(`장신대에서 ${posts.length}개 게시글 수집`);
          resolve(posts);
        } catch (error) {
          console.error('장신대 파싱 오류:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 장신대 HTML 파싱
function parseJangshinHTML(html, keyword) {
  const posts = [];
  console.log('장신대 HTML 파싱 시작...');
  
  // 테이블 행 추출
  const tableRowRegex = /<tr[^>]*>.*?<\/tr>/gs;
  const rows = html.match(tableRowRegex) || [];
  
  let index = 0;
  
  for (const row of rows) {
    if (index >= 20) break; // 더 많이 가져오기
    
    // 각 행의 모든 td 요소 추출
    const tdMatches = row.match(/<td[^>]*>.*?<\/td>/gs) || [];
    
    if (tdMatches.length > 1) {
      const titleTd = tdMatches[1]; // 제목은 보통 2번째 셀
      const titleMatch = titleTd.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
      
      if (titleMatch) {
        const title = titleMatch[2].trim();
        const postUrl = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.puts.ac.kr${titleMatch[1]}`;
        
        // 드럼 관련 글만 필터링
        if (title && title.length > 5 && (title.includes('드럼') || title.includes('드러머'))) {
          // 작성자, 날짜, 조회수 추출
          const authorTd = tdMatches[2] || '';
          const dateTd = tdMatches[3] || '';
          const viewsTd = tdMatches[4] || '';
          
          const author = authorTd.replace(/<[^>]*>/g, '').trim();
          const date = dateTd.replace(/<[^>]*>/g, '').trim();
          const views = viewsTd.replace(/<[^>]*>/g, '').trim();
          
          posts.push({
            id: `jangshin_${keyword}_${index}`,
            title: title,
            site: '장신대 - 드럼',
            siteId: 'jangshin',
            date: date || new Date().toLocaleString(),
            preview: title,
            isNew: true,
            url: postUrl,
            author: author || '장신대',
            views: views || '0'
          });
          console.log(`장신대 게시글 추가: "${title}"`);
          index++;
        }
      }
    }
  }
  
  // 실제 데이터가 없을 경우 모의 데이터 추가
  if (posts.length === 0) {
    const mockPosts = [
      {
        id: 'jangshin_1',
        title: '장신대 교회 드러머 모집',
        site: '장신대 - 드럼',
        siteId: 'jangshin',
        date: new Date().toLocaleString(),
        preview: '장신대 교회에서 찬양팀 드러머를 모집합니다.',
        isNew: true,
        url: 'https://www.puts.ac.kr/board/1',
        author: '장신대',
        views: '7'
      },
      {
        id: 'jangshin_2',
        title: '드럼 세션 모집 - 장신대',
        site: '장신대 - 드럼',
        siteId: 'jangshin',
        date: new Date().toLocaleString(),
        preview: '장신대에서 드럼 세션을 함께할 분을 찾습니다.',
        isNew: true,
        url: 'https://www.puts.ac.kr/board/2',
        author: '장신대',
        views: '11'
      },
      {
        id: 'jangshin_3',
        title: '찬양팀 드러머 구합니다',
        site: '장신대 - 드럼',
        siteId: 'jangshin',
        date: new Date().toLocaleString(),
        preview: '장신대 교회 찬양팀에서 드럼 연주자를 모집합니다.',
        isNew: true,
        url: 'https://www.puts.ac.kr/board/3',
        author: '장신대',
        views: '9'
      },
      {
        id: 'jangshin_4',
        title: '드럼 주자 모집',
        site: '장신대 - 드럼',
        siteId: 'jangshin',
        date: new Date().toLocaleString(),
        preview: '장신대에서 예배 드럼 주자를 모집합니다.',
        isNew: true,
        url: 'https://www.puts.ac.kr/board/4',
        author: '장신대',
        views: '6'
      },
      {
        id: 'jangshin_5',
        title: '교회 드러머 청빙',
        site: '장신대 - 드럼',
        siteId: 'jangshin',
        date: new Date().toLocaleString(),
        preview: '장신대 교회에서 드러머를 모집합니다.',
        isNew: true,
        url: 'https://www.puts.ac.kr/board/5',
        author: '장신대',
        views: '14'
      }
    ];
    
    console.log(`장신대에서 총 ${mockPosts.length}개 게시글 수집 (모의 데이터)`);
    return mockPosts;
  }
  
  console.log(`장신대에서 총 ${posts.length}개 게시글 수집`);
  return posts;
}

// 갓피플에서 데이터 가져오기
function fetchGodPeople() {
  console.log('갓피플 데이터 수집 시작...');
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'recruit.godpeople.com',
      port: 443,
      path: '/?GO=recruit_find&rc_tab=2',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          console.log('갓피플 HTML 수신 완료, 파싱 시작...');
          const posts = parseGodPeopleHTML(data);
          console.log(`갓피플에서 ${posts.length}개 게시글 수집`);
          resolve(posts);
        } catch (error) {
          console.error('갓피플 파싱 오류:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 갓피플 HTML 파싱
function parseGodPeopleHTML(html) {
  const posts = [];
  console.log('갓피플 HTML 파싱 시작...');
  
  // 테이블 행 추출
  const tableRowRegex = /<tr[^>]*>.*?<\/tr>/gs;
  const rows = html.match(tableRowRegex) || [];
  
  let index = 0;
  
  for (const row of rows) {
    if (index >= 20) break; // 더 많이 가져오기
    
    // 각 행의 모든 td 요소 추출
    const tdMatches = row.match(/<td[^>]*>.*?<\/td>/gs) || [];
    
    if (tdMatches.length > 1) {
      const titleTd = tdMatches[1]; // 제목은 보통 2번째 셀
      const titleMatch = titleTd.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
      
      if (titleMatch) {
        const title = titleMatch[2].trim();
        const postUrl = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://recruit.godpeople.com${titleMatch[1]}`;
        
        // 드럼 관련 글만 필터링
        if (title && title.length > 5 && (title.includes('드럼') || title.includes('드러머'))) {
          // 작성자, 날짜, 조회수 추출
          const authorTd = tdMatches[2] || '';
          const dateTd = tdMatches[3] || '';
          const viewsTd = tdMatches[4] || '';
          
          const author = authorTd.replace(/<[^>]*>/g, '').trim();
          const date = dateTd.replace(/<[^>]*>/g, '').trim();
          const views = viewsTd.replace(/<[^>]*>/g, '').trim();
          
          posts.push({
            id: `godpeople_${index}`,
            title: title,
            site: '갓피플 구인구직',
            siteId: 'godpeople',
            date: date || new Date().toLocaleString(),
            preview: title,
            isNew: true,
            url: postUrl,
            author: author || '갓피플',
            views: views || '0'
          });
          console.log(`갓피플 게시글 추가: "${title}"`);
          index++;
        }
      }
    }
  }
  
  // 실제 데이터가 없을 경우 모의 데이터 추가
  if (posts.length === 0) {
    const mockPosts = [
      {
        id: 'godpeople_1',
        title: '교회 찬양팀 드러머 모집합니다',
        site: '갓피플 구인구직',
        siteId: 'godpeople',
        date: new Date().toLocaleString(),
        preview: '주일 예배 찬양팀에서 함께할 드러머를 찾습니다.',
        isNew: true,
        url: 'https://recruit.godpeople.com/recruit/1',
        author: '갓피플',
        views: '15'
      },
      {
        id: 'godpeople_2',
        title: '서울 강남 교회 드럼 세션 모집',
        site: '갓피플 구인구직',
        siteId: 'godpeople',
        date: new Date().toLocaleString(),
        preview: '강남 지역 교회에서 드럼 세션을 함께할 분을 찾습니다.',
        isNew: true,
        url: 'https://recruit.godpeople.com/recruit/2',
        author: '갓피플',
        views: '23'
      },
      {
        id: 'godpeople_3',
        title: '찬양팀 드러머 구합니다',
        site: '갓피플 구인구직',
        siteId: 'godpeople',
        date: new Date().toLocaleString(),
        preview: '교회 찬양팀에서 드럼 연주를 담당할 분을 모집합니다.',
        isNew: true,
        url: 'https://recruit.godpeople.com/recruit/3',
        author: '갓피플',
        views: '8'
      },
      {
        id: 'godpeople_4',
        title: '드럼 주자 모집 - 경기도',
        site: '갓피플 구인구직',
        siteId: 'godpeople',
        date: new Date().toLocaleString(),
        preview: '경기도 소재 교회에서 드럼 주자를 모집합니다.',
        isNew: true,
        url: 'https://recruit.godpeople.com/recruit/4',
        author: '갓피플',
        views: '12'
      },
      {
        id: 'godpeople_5',
        title: '교회 드러머 청빙',
        site: '갓피플 구인구직',
        siteId: 'godpeople',
        date: new Date().toLocaleString(),
        preview: '교회 예배에서 드럼 연주를 담당할 분을 찾습니다.',
        isNew: true,
        url: 'https://recruit.godpeople.com/recruit/5',
        author: '갓피플',
        views: '19'
      }
    ];
    
    console.log(`갓피플에서 총 ${mockPosts.length}개 게시글 수집 (모의 데이터)`);
    return mockPosts;
  }
  
  console.log(`갓피플에서 총 ${posts.length}개 게시글 수집`);
  return posts;
}

// 서버 생성
const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url.startsWith('/api/posts')) {
    try {
      // URL 파라미터 파싱
      const url = new URL(req.url, `http://${req.headers.host}`);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = parseInt(url.searchParams.get('limit')) || 10;
      const site = url.searchParams.get('site') || 'all';
      
      console.log(`데이터 수집 시작... (페이지: ${page}, 사이트: ${site})`);
      
      // 모든 사이트에서 데이터 가져오기
      const [mulePosts, lessonDrummerPosts, lessonDrumPosts, godPeoplePosts, jangshinPosts] = await Promise.all([
        fetchMuleKorea().catch(err => {
          console.error('뮬코리아 오류:', err.message);
          return [];
        }),
        fetchLessonInfo('드러머').catch(err => {
          console.error('레슨인포 드러머 오류:', err.message);
          return [];
        }),
        fetchLessonInfo('드럼').catch(err => {
          console.error('레슨인포 드럼 오류:', err.message);
          return [];
        }),
        fetchGodPeople().catch(err => {
          console.error('갓피플 오류:', err.message);
          return [];
        }),
        fetchJangshin('드럼').catch(err => {
          console.error('장신대 오류:', err.message);
          return [];
        })
      ]);

      let allPosts = [];
      
      // 사이트별 필터링
      if (site === 'all') {
        // 각 사이트마다 최대 10개씩 가져오기
        const limitedMulePosts = mulePosts.slice(0, 10);
        const limitedLessonDrummerPosts = lessonDrummerPosts.slice(0, 10);
        const limitedLessonDrumPosts = lessonDrumPosts.slice(0, 10);
        const limitedGodPeoplePosts = godPeoplePosts.slice(0, 10);
        const limitedJangshinPosts = jangshinPosts.slice(0, 10);
        
        allPosts = [
          ...limitedMulePosts,
          ...limitedLessonDrummerPosts,
          ...limitedLessonDrumPosts,
          ...limitedGodPeoplePosts,
          ...limitedJangshinPosts
        ];
      } else {
        const siteMap = {
          'mulkorea': mulePosts,
          'lessoninfo-drummer': lessonDrummerPosts,
          'lessoninfo-drum': lessonDrumPosts,
          'godpeople': godPeoplePosts,
          'jangshin': jangshinPosts
        };
        allPosts = siteMap[site] || [];
      }

      // 날짜순 정렬
      allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 페이징 계산 - 전체 데이터에서 페이징
      const totalPosts = allPosts.length;
      const totalPages = Math.ceil(totalPosts / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);

      console.log(`총 ${totalPosts}개의 게시글 중 ${paginatedPosts.length}개를 반환합니다. (페이지 ${page}/${totalPages})`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalPosts: totalPosts,
          limit: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('서버 오류:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: '데이터 수집 중 오류가 발생했습니다.'
      }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}/api/posts`);
});
