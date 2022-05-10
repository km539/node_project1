const express = require("express");
const app = express();
const PORT = 8080;

//parses incoming requests with JSON payloads 
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
// ejs
app.set('view engine', 'ejs');
//load the files in the designated directory
app.use(express.static('frontend'));


//Routes
app.use("/admin", require('./routers/admin')); //サーバー側の処理
app.use("/", require('./routers/user')); //ユーザー側の処理

app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));
