const express = require("express");
const router = express.Router();
const ROOT = require("../constants");
const event = require('../queryMaker.js');

router.get("/user/:username", (req, res) => {
    const username = req.params.username;
    res.render('index', {
        username: username
    });
});

router.get("/check/:username/:category", async (req, res) => {
    const username = req.params.username;
    const category = req.params.category;

    const data = await event.checkUserCategoryScore(username,category);
    res.send(data[0]);
});

//ログイン画面
router.get("/login", (req, res) => {
    return res.render('login', {
        error: '',
    });
});

//check input is valid
router.post("/login", async (req, res) => {
    const loginUserInfo = req.body;
    const data = await event.loginUser(loginUserInfo);
    
    if (data === 0) {
        return res.render('login', {
            error: 'アカウントが存在しません。',
        });
    }else if (data === 1) {
        return res.render('login', {
            error: '名前またはパスワードが正しくありません。',
        });
    }else if (data === 2) {
        return res.redirect('/admin');
    }else{
        return res.redirect(`/user/${data}`);
    }
});

//アカウント登録画面
router.get("/signUp", (req, res) => {
    //res.sendFile("/frontend/signUp.html", {root: ROOT})
    return res.render('signUp', {
        error: '',
    });
});

//register new user
router.post("/signUp", async (req, res) => {
    const signUpInfo = req.body;
    const check = await event.addNewUser(signUpInfo);
    

    if(check === 0){
        console.log('same username account already exist');
        return res.render('signUp', {
            error: '既にその名前は使われています。',
        });
    }

    if(check === 1){
        return res.render('signUp', {
            error: 'パスワードが一致しませんでした。',
        });
    }

    //account signed up
    return res.redirect("/login");
});

//ユーザー情報の確認
router.get("/userinfo/:username", async (req,res) => {
    const username = req.params.username;
    const user = await event.getUser(username);
    const userScoreTable = await event.getUserScore(username);
    res.render('userTable', {
        name: user[0],
        userScores: userScoreTable
    });
})

//クイズ確認
router.get("/quiz/:tablename", async (req, res) => {
    const tablename = req.params.tablename;
    const table = await event.showQuestiontable(tablename);
    res.render('table', {
        tables: table,
        tablename: tablename
    });
})

//結果画面表示
router.post("/review", async (req, res) => {
    //console.log(req.body);
    const userAnswers = req.body.selectedChoices;
    const userResult = await event.checkAnswer(req.body.category, req.body.username, userAnswers);
    res.render('result', {
        userResult: userResult
    });
});
module.exports = router;