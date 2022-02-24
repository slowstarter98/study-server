// 서버를 띄우기 위한 기본 셋팅
const express = require("express");
const app = express();

// body-parser 임포트 + 사용하기 위해 express에 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ejs를 사용하기 위해 등록해주는 코드
// 이걸 해줘야 ejs로 쓴 html을 node.js 가 렌더링해준다.
app.set("view engine", "ejs");

//어떤 DB에다가 data를 저장할 건지
var db;

// MongoDB를 연결하기 위해서 쓰는 코드---------------------------
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

    // db속에 우리가 생성했던 collection 중에
    // 'post'에 정보를 저장하기 위한 문법
    // 임시코드라 아무데나 써본거다
    // @@데이터는 !!!object 자료형!!!으로 저장을 해야 한다.@@
    // db.collection("post").insertOne(
    //   { _id: 100, 이름: "john", 나이: 20 },
    //   function (에러, 결과) {
    //     console.log("저장완료");
    //   }
    // );

    app.listen(8080, function () {
      console.log("listening on 8080  + MongoDB 접속완료");
    });
  }
); //------------------------------------------------------------------

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

// 앞으로 할 거 == DB에 저장해주세요 --> 받은 정보를 영구 저장
//어떠 사람이 /add라는 경로로 post 요청ㅇ르 하면,
//데이터 2개(날짜 , 제목)를 보내주는데
//이 때 ,'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
// ' /write ' 경로로 post 요청이 나라온다면 실행하는 api
// 이게 에로우함수였나 글머
app.post("/add", (요청, 응답) => {
  응답.send(요청.body.title);

  db.collection("counter")
    // find == 전부 탐색 , findOne == 하나만 찾기
    .findOne({ name: "게시물갯수" }, function (에러, 결과) {
      console.log("게시물 갯수" + (결과.totalPost + 1));
      var 총게시물갯수 = 결과.totalPost;
      // id에 총게시물 갯수 +1을하기 위한 기능 auto increment
      // db에 항목을 추가할 때마다 자동으로 1증가시켜서 저장하는거
      // 근데 mongodb는 없어서 손수 만들어야 한다.
      // 따로 colletion을 만들어서 번호를 관리
      db.collection("post").insertOne(
        { _id: 총게시물갯수 + 1, 제목: 요청.body.title, 시간: 요청.body.date },
        function (에러, 결과) {
          console.log("db에 전송 완료");
          // + 수정해줘야 하는데 totalPost 값 ++ 해줘야 한다.
          // 1개 업데이트하는함수 updateOne 요소 3개 들어간다.
          // updateOne(요런데이터를,요렇게수정해주셈)
          // update 류의 함수를 사용할 때 operator를 사용해야 한다.
          // operator = { ?? : {totalPost: totoalPost+1} } 중괄호 안에 중괄호
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            // $set = operator 중 변경 연산
            // 연산자(operator)는 여러개가 깅싿
            // $inc 증가 , $min 기존값 보다 적을때만 변경
            // , $rename key값 이름변경 ...등등등 필요할 때 찾아서 쓰면 된다.
            // 1더해준다.
            { $inc: { totalPost: 1 } },
            // 업데이트가 완료되면 실행해주세요의 콜백함수
            // 에러체크시 매개변수 2개 ㄱㄱ
            // 없어도 된다.
            function (에러, 결과) {
              if (에러) {
                return console.log(에러);
              }
            }
          );
        }
      );
    });
});

//  /list 로 get요청으로 접속하면
//  html을 보여줌 뭘 보여주냐 --> db에 저장된 데이터들로
//  예쁘게 꿈진 html
app.get("/list", function (요청, 응답) {
  // 디비에 저장된 post라는 이름을 가진 collection의
  // (모든,제목=??인)데이터를 꺼내주세요.
  // 모든 데이터를 꺼낸다 --> .find().toArray(function(에러,결과){}) 이게 한 세트
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);

      // 작명의 시간
      응답.render("list.ejs", { posts: 결과 });
    });
});

// list.ejs 파일의 ajax 부분에서 실행된다. 아니면 따로 경로를 들어가든지
app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);

  // 안에 들어있는걸 정수로 변환하는 함수
  // Object 분야 자료를 다루는게 어렵다면 따로 공부하자(오브젝트 스킬)
  요청.body._id = parseInt(요청.body._id);
  // 삭제시켜주는 함수 deleteOne
  // 왼쪽요소는 어떤 요소를 찾아서 죽일지 찾는 조건
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
  });
});
