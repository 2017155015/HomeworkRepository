const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

const express = require("express");

const fs = require("fs");

const app = express();

const PORT = process.env.PORT||8000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'test.db',
        driver: sqlite3.Database
    });
    return db;
}

app.post("/write-file", function (req, res) {
    console.log(req.body);

    if (!req.body?.content) {
        res.status(400).send("400 에러! content가 post body에 없습니다!");
        return;
    }

    fs.writeFile("test.txt", req.body.content, function (error, data) {
        if (error) {
            res.status(500).send("500 서버 에러!");
        } else {
            res.status(201).send("파일 생성 성공!");
        }
    });
});

app.get("/read-file", function (req, res) {
    console.log(req.query);

    if (!req.query?.file) {
        res.status(400).send("400 에러! file이 query parameters에 없습니다.");
        return;
    }

    fs.readFile(req.query.file, "utf-8", async function (error, data) {
        if (error) {
            if (error.code == "ENOENT") {
                res.status(404).send('${req.query.file}이 없습니다.');
            } else {
                res.status(500).send("500 서버 에러!");
            }
        } else {
            res.status(200).send(data.toString());
        }
    });
});

app.get("/", async function(req, res) {
    let db = await getDBConnection()
    let rows = await db.all('select * from images');
    await db.close();
    myimage_info = '';
    
    for (var i = 0; i < rows.length; i++) {
        myimage_info += 'image_id: ' + rows[i]['image_id'] + ', image_name: ' + rows[i]['image_name'] + ', image_path: ' + rows[i]['image_path'] + '<br>';
    }

    console.log(myimage_info)
    var output = 
    `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                ${myimage_info}
            </body>
        </html>`;
    
    res.send(output);
});

app.get("/posts", function (req, res) {
    res.json([
        { postId: 1, title: "Hello!" },
        { postId: 2, title: "World!" },
    ]);
})

app.listen(PORT, () => {
    console.log("서버가 실행됐습니다.");
    console.log(`서버주소: http://localhost:${PORT}`);
});