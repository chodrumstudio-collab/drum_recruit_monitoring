// 간단한 서버 시작 스크립트
const { spawn } = require('child_process');
const path = require('path');

console.log('드럼 리크루팅 모니터링 시스템 서버를 시작합니다...');

// Node.js 경로 설정
const nodePath = path.join(__dirname, 'node-v20.10.0-darwin-x64/bin/node');
const npmPath = path.join(__dirname, 'node-v20.10.0-darwin-x64/bin/npm');

// 서버 의존성 설치
console.log('서버 의존성을 설치합니다...');
const installProcess = spawn(npmPath, ['install', 'express', 'cors', 'puppeteer'], {
  stdio: 'inherit',
  env: { ...process.env, PATH: `${path.join(__dirname, 'node-v20.10.0-darwin-x64/bin')}:${process.env.PATH}` }
});

installProcess.on('close', (code) => {
  if (code === 0) {
    console.log('의존성 설치 완료. 서버를 시작합니다...');
    
    // 서버 실행
    const serverProcess = spawn(nodePath, ['server.js'], {
      stdio: 'inherit',
      env: { ...process.env, PATH: `${path.join(__dirname, 'node-v20.10.0-darwin-x64/bin')}:${process.env.PATH}` }
    });

    serverProcess.on('close', (code) => {
      console.log(`서버가 종료되었습니다. 코드: ${code}`);
    });
  } else {
    console.error('의존성 설치 실패');
  }
});
