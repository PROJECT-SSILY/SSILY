## 1. 프로젝트 개요

### 1) 프로젝트 목표 ✨

WebRTC를 활용한 아이들의 협동심을 증진시키고, 몸짓과 그림을 사용해 소통하는 방식을 배워 감수성을 증진시킬 수 있는 게임 서비스 개발

### 2) 주요 기능 ⚙

1. 마이페이지에서 자신의 게임 전적, 승률 및 로봇 상태 확인
2. 직접, 랜덤으로 구분된 게임방 입장 가능
3. Quick Draw 데이터셋을 이용한 답안 자동 인식
4. Fabric js을 이용한 그림판 기능
5. 게임 진행 상황에 맞는 자동 레이아웃 변경 및 소리 제어

### 3) 전체 일정 📅

23.01.09 ~ 23.02.17 (6주)

| 기간 | 내용 |
| --- | --- |
| 01.09 ~ 01.16 | 아이디어 선정 및 요구사항 분석 |
| 01.17 ~ 01.20 | 기능 명세서, 와이어프레임, REST API 작성 |
| 01.25 ~ 01.29 | 회원가입, 로그인 등 회원 서비스 개발 |
| 01.30 ~ 02.13 | Openvidu 커스텀, Quick Draw 모델 학습 등 게임 개발 |
| 02.13 ~ 02.15 | 버그 수정 |
| 02.16 ~ 02.17 | 서비스 배포 및 유지보수 |

### 4) 구성원 🥰

- 신대득: 팀장, 백엔드 개발 및 Git 관리자
- 김윤미: 백엔드 개발 및 Jira 관리자
- 서영탁: 백엔드 개발 및 Git 관리자
- 원채령: 프론트엔드 개발 및 발표자
- 이수연: 프론트엔드 개발 및 서기
- 이은혁: 프론트엔드 개발 및 UCC 제작자

<br>

## 2. 프로젝트 설계

### 1) [피그마](https://www.figma.com/file/xpRzx7R4nJ2rhNMavXAGhP/%EC%8B%B8%EA%B3%BC?node-id=0%3A1&t=2Q40LAqNcJXfkC5u-1)

### 2) 개발환경

| Backend | Frontend | CI | Collaboration Tools |
| --- | --- | --- | --- |
| Java 11 | Vue3 | AWS EC2 | GitLab |
| Spring Boot Gradle | Javascript | Docker | Jira |
| Spring Data JPA | Vuetify3 |  | Notion |
| Lombok | node.js (v18.13.0) |  | Discord |
| JWT | fabric.js |  |  |
| Spring Security |  |  |  |
| MySQL |  |  |  |
| Openvidu 커스텀 |  |  |  |

### 3) 아키텍처
<img width="704" alt="image" src="https://user-images.githubusercontent.com/89503136/219449502-62d3b139-7735-40ee-a4d3-d92d54cf7b93.png">

### 4) [REST API](https://abundant-panda-e6d.notion.site/REST-API-6ad2658368064f578fd2d20547ce6c5c)

### 5) Git
![gitflow](https://user-images.githubusercontent.com/89503136/219453561-4f0e097f-1e3b-4a4f-b558-10a998ed6fbe.gif)

<br>

## 3. 프로젝트 소개

### 1) 회원가입
![회원가입](https://user-images.githubusercontent.com/89503136/219454750-5767b29d-4d3a-40e0-8313-d20547429e28.gif)

### 2) 마이페이지
![마이페이지](https://user-images.githubusercontent.com/89503136/219455570-2f225afc-38ac-433a-ac83-0d0d95e3e93a.gif)

### 3) 닉네임 변경
![닉네임변경](https://user-images.githubusercontent.com/89503136/219461827-8a1632ab-bfab-4a8a-982f-71c35a16100a.gif)

### 4) 로그아웃
![로그아웃](https://user-images.githubusercontent.com/89503136/219461849-417ad3a7-0e2d-45ab-a711-50f399af77d8.gif)

### 5) 방 생성
![방 생성](https://user-images.githubusercontent.com/89503136/219461853-c1167ae7-5f1c-4613-87de-1ba65d1248a6.gif)

### 6) 방 입장(직접 입장)
![방 입장(직접 입장)](https://user-images.githubusercontent.com/89503136/219461863-370582c1-86b0-4d6f-bee3-48ecce8a6b9e.gif)

### 7) 방 입장(바로 입장)
![방 입장(바로 입장)](https://user-images.githubusercontent.com/89503136/219461868-e3374844-3d7a-43aa-893c-43654f7a3878.gif)

### 8) 준비 상태
![준비 상태](https://user-images.githubusercontent.com/89503136/219461886-6671f090-df7c-4849-909e-2f33d0c37238.gif)

### 9) 방장 변경
![방장 변경](https://user-images.githubusercontent.com/89503136/219461903-5dbf2b3d-db8c-4f16-932b-adec5fe5d2a0.gif)

### 10) 채팅
![채팅](https://user-images.githubusercontent.com/89503136/219461908-e99e0e3e-6f73-44e6-9a95-85ab3203290c.gif)

### 11) 게임 진행
![게임 진행](https://user-images.githubusercontent.com/89503136/219461922-9c2a9545-d202-47c1-b807-a8fe50cb3c56.gif)

### 12) 결과 페이지
![결과 페이지](https://user-images.githubusercontent.com/89503136/219461933-e1780630-2594-449b-a6fc-09c9234cb1b1.gif)

