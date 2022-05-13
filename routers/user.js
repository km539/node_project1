const express = require("express");
const router = express.Router();
const ROOT = require("../constants");
const event = require('../queryMaker.js');

//結果画面表示
router.post("/review", async (req, res) => {
    const userAnswers = req.body.selectedChoices;
    const user_id = req.body.username;
    const category_id = req.body.category;
    const userResult = await event.checkAnswer(user_id, category_id, userAnswers);
    res.render('result', {
        userResult: userResult
    });
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
    }
    if (data === 1) {
        return res.render('login', {
            error: '名前またはパスワードが正しくありません。',
        });
    }
    
    if (data === 2) { //管理者画面へ
        return res.redirect('/admin');
    }

    return res.redirect(`/user/${data[0].id}`);
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


    if (check === 0) {
        console.log('same username account already exist');
        return res.render('signUp', {
            error: '既にその名前は使われています。',
        });
    }

    if (check === 1) {
        return res.render('signUp', {
            error: 'パスワードが一致しませんでした。',
        });
    }

    //account signed up
    return res.redirect("/login");
});

//ユーザー情報の確認
router.get("/user/info/:uuid", async (req, res) => {
    const uuid = req.params.uuid;
    const user = await event.getUser(uuid);
    const userScoreTable = await event.getUserScore(uuid);
    return res.render('userTable', {
        name: user[0],
        userScores: userScoreTable
    });
})

//クイズを見せる
router.get("/quiz/:category", async (req, res) => {
    const category_id = req.params.category;
    const table = await event.showQuestiontable(category_id);
    res.render('table', {
        tables: table,
    });
})

router.get("/user/:uuid", async (req, res) => {
    const uuid = req.params.uuid;
    const user = await event.getUser(uuid);
    const category = await event.getAllCategory();
    const answered = await event.getAnsweredQuiz(uuid);
    
    //回答していないクイズのみ選択
    for (let i = 0; i < category.length; i++) {
        for (let j = 0; j < answered.length; j++) {
            if (category[i].id == answered[j].category_id) {
                category.splice(i, 1);
            }
        }
    }
    res.render('index', {
        user: user[0],
        category: category
    });
});

router.get("/check/:username/:category", async (req, res) => {
    const username = req.params.username;
    const category = req.params.category;

    const data = await event.checkUserCategoryScore(username, category);
    res.send(data[0]);
});

module.exports = router;