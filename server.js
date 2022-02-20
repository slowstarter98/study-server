// 서버를 띄우기 위한 기본 셋팅
const express = require("express");
const app = express();

//어떤 DB에다가 data를 저장할 건지
var db;

// MongoDB를 연결하기 위해서 쓰는 코드
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://forrest:gump98@cluster0.fg476.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (error, client) => {
    //접속이 완료되면 아래 코드를 실행해주셈~

    //에러가 났을 때 에러 출력
    //99%의 에러 = url오타 , 나머지 1% =위에 import 오타
    if (error) {
      return console.log(error);
    }

    //client는 콜백함수의 인자 client
    //todoap 이라는 db(폴더)에 연결좀여
    db = client.db("todoapp");

    // db속에 우리가 생성했던 collection
    // 'post'에 정보를 저장하기 위한 문법
    // 임시코드라 아무데나 써본거다
    // @@데이터는 !!!object 자료형!!!으로 저장을 해야 한다.@@
    db.collection("post").insertOne(
      { _id: 100, 이름: "john", 나이: 20 },
      function (에러, 결과) {
        console.log("저장완료");
      }
    );

    app.listen(8080, function () {
      console.log("listening on 8080  + MongoDB 접속완료");
    });
  }
);

// body-parser 임포트 + 사용하기 위해 express에 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// 첫번째 파라미터는 서버를 띄울 포트번호,
// 두번째 파라미터 == 함수 는 서버를 띄운 후 실행할 코드
// 참고로 포트는 한 컴퓨터당  한 6만개 있는데 그중 8080으로 들어온
// 사람은  함수의 코드를 실행한다는 코드다
// 포트번호는 로컬 서버에서 기준이 되주는 번호
// 그뒤에 여러가지가 붙어서 (/pet,/beauty등등 추가경로 같은게) 요청을 한다
// app.listen(8080, function () {
//   //요건 컴퓨터 터미널에서 로그가 나오는 거다.
//   console.log("listening on 8080");
// });

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
});

app.get("/write", function (요청, 응답) {
  // 홈페이지에 접속했을 때 파일을 보내는 함수 sendFile
  응답.sendFile(__dirname + "/write.html");
});

// ' /write ' 경로로 post 요청이 나라온다면 실행하는 api
// 이게 에로우함수였나 글머
app.post("/add", (요청, 응답) => {
  응답.send(요청.body.title);

  db.collection("post").insertOne(
    { _id: 1, 제목: 요청.body.title, 날짜: 요청.body.date },
    function (에러, 결과) {
      console.log("db에 전송 완료");
    }
  );
});

// 앞으로 할 거 == DB에 저장해주세요 --> 받은 정보를 영구 저장

//어떠 사람이 /add라는 경로로 post 요청ㅇ르 하면,
//데이터 2개(날짜 , 제목)를 보내주는데
//이 때 ,'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
