// 서버를 띄우기 위한 기본 셋팅
const express = require("express");
const app = express();

// body-parser 임포트 + 사용하기 위해 express에 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// 첫번째 파라미터는 서버를 띄울 포트번호,
// 두번째 파라미터 == 함수 는 서버를 띄운 후 실행할 코드
// 참고로 포트는 한 컴퓨터당  한 6만개 있는데 그중 8080으로 들어온
// 사람은  함수의 코드를 실행한다는 코드다

// 포트번호는 로컬 서버에서 기준이 되주는 번호
// 그뒤에 여러가지가 붙어서 (/pet,/beauty등등 추가경로 같은게) 요청을 한다
app.listen(8080, function () {
  //요건 컴퓨터 터미널에서 로그가 나오는 거다.
  console.log("listening on 8080");
});

// 누군가가 /pet 으로 방문을 하면
// pet 관려된 안내문을 띄워주자
app.get("/pet", function (요청, 응답) {
  응답.send("펫 홈페이지입니다.");
});

app.get("/beauty", function (요청, 응답) {
  응답.send("뷰티 홈페이지입니다.");
});

// 슬래쉬(' / ') 하나만 쓰면 홈
app.get("/", function (요청, 응답) {
  // 홈페이지에 접속했을 때 파일을 보내는 함수 sendFile
  응답.sendFile(__dirname + "/index.html");
  console.log(요청);
});

app.get("/write", function (요청, 응답) {
  // 홈페이지에 접속했을 때 파일을 보내는 함수 sendFile
  응답.sendFile(__dirname + "/write.html");
});

// ' /write ' 경로로 post 요청이 나라온다면 실행하는 api
// 이게 에로우함수였나 글머
app.post("/add", (요청, 응답) => {
  응답.send(요청.body.title);
});
