const express = require("express");
const userRouter = require('./routers/user')
const adminRouter = require('./routers/admin')

const app = express();
const PORT = 8080;

// ejs
app.set('view engine', 'ejs');
//load the files in the designated directory
app.use(express.static('frontend'));

//parses incoming requests with JSON payloads 
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

//Routes
/*const indexHandler = (req,res,next)=>{
    res.render('index.ejs')
}    

app.get("/", indexHandler); //
*/
app.use("/", userRouter); //ユーザー側の処理
app.use("/admin", adminRouter); //サーバー側の処理
app.use(errorHandler)
app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    console.log(err);
    res.status(500)
    res.render('error', {
        error: err
    })
}

process.on('uncaughtException', (error, origin) => {
    console.log('origin', origin);
    console.error('error', error);
})