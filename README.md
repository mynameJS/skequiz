![스크린샷 2024-09-08 오후 12 47 54](https://github.com/user-attachments/assets/9894e24e-bb7a-43ff-8ce9-04bfdea4bb7b)



> 프로젝트명 : S K E Q U I Z
>
> 프로젝트 소개 : 턴제 게임 기반의 실시간 그림 퀴즈 서비스
>
> 개발 기간: 2024. 8. 22 ~ 9. 6 (1차 배포) (Develop 진행중)
>
> [SKEQUIZ](https://skequiz.netlify.app/)

<br />
<br />

## 🎯 주요 기능

### `메인페이지`
#### 스케치룸에 입장하기 전 닉네임을 설정할 수 있습니다. 닉네임을 입력 후 Play 버튼을 누르면 현재 입장 가능한 Public 스케치룸으로 입장하게 됩니다.
#### Public 스케치룸은 제한인원 6명, 제시어 카테고리 제한 없음, 총 3라운드, 출제시간 90초의 기본값을 가지게 됩니다.
#### 현재 입장 가능한 Public 스케치룸이 없다면 새로운 Public 스케치룸이 생성되며 다른 플레이어를 기다리게 됩니다.

![스크린샷 2024-09-08 오후 1 04 53](https://github.com/user-attachments/assets/10ef7e40-d4cd-432a-aea3-02a5242176f0)



<br />

### `스케치룸`
#### Public 스케치룸의 경우 대기 상태에서 인원이 2명이상이 된다면 자동으로 게임이 시작됩니다. 
#### 출제자는 랜덤으로 생성된 제시어 3개 중 하나를 고르게 되며 제한시간 동안 그림으로 설명을 하게 됩니다.
#### 참여자는 출제자가 그린 그림을 보고 제시어를 채팅으로 맞출 수 있으며, 제한시간 내에 정답을 맞추게 되면 점수를 획득하게 됩니다.
#### 모든 라운드가 끝나게 되면 가장 높은 점수를 얻은 플레이어가 우승하게 되고, 다시 새로운 게임이 시작됩니다.

![스크린샷 2024-09-08 오후 12 43 51](https://github.com/user-attachments/assets/bbeee593-b68f-48d5-afe1-b0ab9ad0ef28)

<br />


## 🧰 기술 스택


| **FE**    |           | **BE**    |           |
|-----------|-----------|-----------|-----------|
| **분류**  | **기술**  | **분류**  | **기술**  |
| FrameWork | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff) | Server    | ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=ffffff)  ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=ffffff)|
| Language  | ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff) | DevOps | ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=ffffff) |
| Styles    | ![CSS Modules](https://img.shields.io/badge/CSS%20Modules-4B32C3?style=for-the-badge&logo=CSSModules&logoColor=white) ![SCSS](https://img.shields.io/badge/SCSS-cc6699?style=for-the-badge&logo=Sass&logoColor=white) | Library | ![Dotenv](https://img.shields.io/badge/dotenv-0F9D58?style=for-the-badge&logoColor=ffffff) ![Express](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=ffffff) ![Socket.io](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketio&logoColor=ffffff) |
| HTTP      | <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=ffffff" alt='firebase'> |           |           |
| Code Convention | ![Eslint](https://img.shields.io/badge/Eslint-4B32C3?style=for-the-badge&logo=Eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white) |           |           |
| Hosting   | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white) |           |           |
| Build     | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=ffffff) |           |           |
| Library   | ![Socket.io](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketio&logoColor=ffffff) ![Zustand](https://img.shields.io/badge/Zustand-F0BA47?style=for-the-badge&logoColor=ffffff) ![Nanoid](https://img.shields.io/badge/nanoid-03C75A?style=for-the-badge&logoColor=ffffff) ![FakerJS](https://img.shields.io/badge/fakerJS-F7DF1E?style=for-the-badge&logoColor=ffffff) |           |           |


## 🛠️ 추가 구현 계획

1. Private 스케치룸 생성 (커스텀 RoomConfig) (적용 완료)
2. 영역 전체 색칠 기능 (fill area) (적용 완료)
3. 모바일 반응형
4. 플레이어 별 랜덤 능력 부여 (제한 시간 외 추가시간 부여, 제시어 힌트 추가제공 등)
5. 그림 좋아요 기능
6. 솔로플레잉 기능 (저장된 다른 사람이 그린 그림 맞추는 챌린지)





