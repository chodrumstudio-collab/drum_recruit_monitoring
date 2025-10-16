const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 뮬코리아 스크래핑 함수
async function scrapeMuleKorea() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.mule.co.kr/bbs/info/recruit?page=1&map=list&mode=list&region=&start_price=&end_price=&qf=title_legacy&qs=%EA%B5%90%ED%9A%8C&category=%EB%A9%A4%EB%B2%84%EA%B5%AC%EC%9D%B8&ct1=&ct2=&ct3=&store=&options=&soldout=&sido=&gugun=&dong=&period=6&of=wdate&od=desc&andor=and&v=l', {
      waitUntil: 'networkidle2'
    });

    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('table tr');
      const results = [];
      
      // 테이블 구조 디버깅
      console.log('뮬코리아 테이블 행 수:', postElements.length);
      
      postElements.forEach((row, index) => {
        if (index === 0) {
          // 헤더 행의 모든 셀 내용 출력
          const headerCells = row.querySelectorAll('td, th');
          console.log('뮬코리아 헤더 셀들:');
          headerCells.forEach((cell, cellIndex) => {
            console.log(`셀 ${cellIndex}:`, cell.textContent.trim());
          });
          return;
        }
        
        // 각 행의 모든 셀 내용 출력
        const cells = row.querySelectorAll('td');
        console.log(`뮬코리아 행 ${index} 셀들:`);
        cells.forEach((cell, cellIndex) => {
          const cellText = cell.textContent.trim();
          const cellLinks = cell.querySelectorAll('a');
          console.log(`  셀 ${cellIndex}: "${cellText}" (링크 ${cellLinks.length}개)`);
          
          cellLinks.forEach((link, linkIndex) => {
            console.log(`    링크 ${linkIndex}: "${link.textContent.trim()}" -> ${link.href}`);
          });
        });
        
        // 뮬코리아 테이블에서 제목 찾기 - 여러 셀 확인
        let validTitle = null;
        let validUrl = null;
        
        // 각 셀을 순서대로 확인하여 제목 찾기
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
          const cell = cells[cellIndex];
          const cellText = cell.textContent.trim();
          const cellLinks = cell.querySelectorAll('a');
          
          for (const link of cellLinks) {
            const linkText = link.textContent.trim();
            const linkHref = link.href;
            
            console.log(`뮬코리아 셀 ${cellIndex} 링크: "${linkText}"`);
            
            // 제목 후보 필터링
            if (linkText.length >= 10 && // 충분히 긴 제목
                linkText.length <= 100 && // 너무 긴 제목 제외
                !/^[가-힣]{2,4}$/.test(linkText) && // 닉네임 패턴 제외
                !linkText.includes('조회') && 
                !linkText.includes('추천') &&
                !linkText.includes('답변') &&
                !linkText.includes('댓글') &&
                linkHref.includes('/bbs/') && // 게시글 링크인지 확인
                (linkText.includes('드럼') || linkText.includes('드러머'))) {
              
              // 교회 관련 글 중에서 드럼 관련 글만 필터링
              const churchKeywords = ['교회', '찬양', '예배', '세션', '주일', '수요', '금요'];
              const drumKeywords = ['드럼', '드러머', '드럼주자', '드럼연주', '드럼세션'];
              
              const isChurchRelated = churchKeywords.some(keyword => linkText.includes(keyword));
              const isDrumRelated = drumKeywords.some(keyword => linkText.includes(keyword));
              
              if (isChurchRelated && isDrumRelated) {
                console.log('뮬코리아 유효한 제목 발견:', linkText);
                validTitle = linkText;
                validUrl = linkHref;
                break;
              }
            }
          }
          
          if (validTitle) break;
        }
        
        if (validTitle) {
          const authorElement = cells[3];
          const dateElement = cells[4];
          const viewsElement = cells[5];
          
          results.push({
            title: validTitle,
            author: authorElement ? authorElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            views: viewsElement ? viewsElement.textContent.trim() : '',
            url: validUrl,
            site: '뮬코리아 (교회 멤버 구인)',
            siteId: 'mulkorea'
          });
        }
      });
      
      return results.slice(0, 10); // 최신 10개만
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error('뮬코리아 스크래핑 오류:', error);
    await browser.close();
    return [];
  }
}

// 레슨인포 스크래핑 함수
async function scrapeLessonInfo(keyword) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.lessoninfo.co.kr/board/board.php?mode=search&board_code=20130529164321_7227&code=20170307205423_8969&bo_table=20161213204725_5754&sca=&sort=&search_field=wr_subject&search_keyword=${encodedKeyword}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.board_list tr');
      const results = [];
      
      postElements.forEach((row, index) => {
        if (index === 0) return; // 헤더 스킵
        
        const titleElement = row.querySelector('td.subject a');
        const authorElement = row.querySelector('td.name');
        const dateElement = row.querySelector('td.date');
        const viewsElement = row.querySelector('td.hit');
        
        if (titleElement) {
          results.push({
            title: titleElement.textContent.trim(),
            author: authorElement ? authorElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            views: viewsElement ? viewsElement.textContent.trim() : '',
            url: titleElement.href,
            site: keyword === '드러머' ? '레슨인포 - 드러머' : '레슨인포 - 드럼',
            siteId: keyword === '드러머' ? 'lessoninfo-drummer' : 'lessoninfo-drum'
          });
        }
      });
      
      return results.slice(0, 10); // 최신 10개만
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error('레슨인포 스크래핑 오류:', error);
    await browser.close();
    return [];
  }
}

// 갓피플 스크래핑 함수
async function scrapeGodPeople() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://recruit.godpeople.com/?GO=recruit_find&rc_tab=2', {
      waitUntil: 'networkidle2'
    });

    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.recruit_list tr');
      const results = [];
      
      postElements.forEach((row, index) => {
        if (index === 0) return; // 헤더 스킵
        
        const titleElement = row.querySelector('td:nth-child(2) a');
        const authorElement = row.querySelector('td:nth-child(3)');
        const dateElement = row.querySelector('td:nth-child(4)');
        const viewsElement = row.querySelector('td:nth-child(5)');
        
        if (titleElement) {
          const title = titleElement.textContent.trim();
          
          // 드럼 관련 글만 필터링
          if (title.includes('드럼') || title.includes('드러머')) {
            results.push({
              title: title,
              author: authorElement ? authorElement.textContent.trim() : '',
              date: dateElement ? dateElement.textContent.trim() : '',
              views: viewsElement ? viewsElement.textContent.trim() : '',
              url: titleElement.href,
              site: '갓피플 구인구직',
              siteId: 'godpeople'
            });
          }
        }
      });
      
      return results.slice(0, 10); // 최신 10개만
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error('갓피플 스크래핑 오류:', error);
    await browser.close();
    return [];
  }
}

// 장신대 스크래핑 함수
async function scrapeJangshin(keyword) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.puts.ac.kr/www/board/list.general.asp?skin=&design=lounge&m1=4&m2=4&m3=1&bd_name=jangshin_jboard04&page=1&pagesize=50&cate=&schBy=%C1%A6%B8%F1%2C%C1%D6%BC%D2%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%A6%B8%F1%2C%C1%D6%BC%D2&schKey=${encodedKeyword}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.board_list tr');
      const results = [];
      
      postElements.forEach((row, index) => {
        if (index === 0) return; // 헤더 스킵
        
        const titleElement = row.querySelector('td.subject a');
        const authorElement = row.querySelector('td.name');
        const dateElement = row.querySelector('td.date');
        const viewsElement = row.querySelector('td.hit');
        
        if (titleElement) {
          results.push({
            title: titleElement.textContent.trim(),
            author: authorElement ? authorElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            views: viewsElement ? viewsElement.textContent.trim() : '',
            url: titleElement.href,
            site: keyword === '드럼' ? '장신대 - 드럼' : '장신대 - 드러머',
            siteId: keyword === '드럼' ? 'jangshin' : 'jangshin-drummer'
          });
        }
      });
      
      return results.slice(0, 10); // 최신 10개만
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error('장신대 스크래핑 오류:', error);
    await browser.close();
    return [];
  }
}

// 모든 사이트에서 데이터 가져오기
app.get('/api/posts', async (req, res) => {
  try {
    console.log('데이터 수집 시작...');
    
    const [mulePosts, lessonDrummerPosts, lessonDrumPosts, jangshinDrumPosts, jangshinDrummerPosts, godPeoplePosts] = await Promise.all([
      scrapeMuleKorea(),
      scrapeLessonInfo('드러머'),
      scrapeLessonInfo('드럼'),
      scrapeJangshin('드럼'),
      scrapeJangshin('드러머'),
      scrapeGodPeople()
    ]);

    const allPosts = [
      ...mulePosts,
      ...lessonDrummerPosts,
      ...lessonDrumPosts,
      ...jangshinDrumPosts,
      ...jangshinDrummerPosts,
      ...godPeoplePosts
    ];

    // 날짜순으로 정렬
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: allPosts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({
      success: false,
      error: '데이터 수집 중 오류가 발생했습니다.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
