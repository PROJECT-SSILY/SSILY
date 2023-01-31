## Openvidu 테스트

#### 0. Docker 설치

#### 1. Maven 설치

```
1. https://maven.apache.org/download.cgi에서 apache-maven-3.8.4-bin.zip설치
2. 압축 적당히 풀기
3. 환경변수 Path에 bin폴더 지정(apache-maven-3.8.4\bin)
4. cmd 창에서 mvn -v으로 확인
```

#### 2. Kurento 중계서버 도커로 설치

```
docker run -d --name kms -p 8888:8888 kurento/kurento-media-server-dev:latest
```

#### 3. openvidu폴더에서

```
mvn -DskipTests=true install
```

#### 4. openvidu/openvidu-server 폴더에서

```
mvn -DDOMAIN_OR_PUBLIC_IP=localhost -DHTTPS_PORT=4443 -DOPENVIDU_SECRET=MY_SECRET exec:java
```

##### #성공시

```
OpenVidu Server URL : https://localhost:4443/
OpenVidu Dashboard : https://localhost:4443/dashboard
```



#### 5. https://localhost:4443들어가서 확인

#### 6. openvidu-insecure-vue 폴더에서 vue실행시킨 후 세션 접속 되는지 확인.
