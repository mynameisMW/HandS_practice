FROM node:20

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY / .

# 빌드
RUN npm run build

# 실행
CMD ["npm", "start"]
