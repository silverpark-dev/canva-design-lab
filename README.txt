CANVA DESIGN LAB — Netlify 공용 링크 저장 버전

폴더 구조
- public/index.html : 웹페이지
- public/title.png : 수업 타이틀 이미지
- netlify/functions/portfolio.mjs : 링크 저장/불러오기 API
- netlify.toml : Netlify 설정
- package.json : @netlify/blobs 의존성

중요
이 프로젝트는 단순 HTML 미리보기에서는 공용 저장이 작동하지 않습니다.
Netlify에 프로젝트 전체를 배포해야 Functions와 Blobs가 활성화됩니다.

배포 후 테스트
1. 학생 카드 선택
2. 1차시 칸에 https:// 로 시작하는 링크 입력
3. 저장
4. 페이지 새로고침
5. 다시 같은 학생을 열어 링크가 남아 있으면 성공
6. 휴대폰에서 같은 Netlify 주소를 열어 같은 링크가 보이면 공용 저장까지 성공
