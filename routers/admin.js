const express = require("express");
const router = express.Router();
const event = require('../queryMaker');
const ROOT = require("../constants");

//管理者画面ページ
router.get("/", async (req, res) => {
    const data = await event.getAllUsers();
    const category = await event.getAllCategory();
    return res.render('admin', {
        users: data,
        category: category
    });
});

//add new question into table
router.post("/add", async (req, res) => {
    const body = req.body;
    const choices = [body.choice1, body.choice2, body.choice3, body.choice4];
    const ansNum = parseInt(body.answer);
    const category_id = parseInt(body.topic);
    await event.addQuestionByCategory(body.question, choices, ansNum, category_id);
    return res.redirect('/admin'); //管理者画面ページ
});

//add new category
router.post("/addCategory", async (req, res) => {
    await event.addNewCategory(req.body.newCategory);
    return res.redirect('/admin'); //管理者画面ページ
});

router.post("/update/scores", async (req, res) => {
    const uuid = req.body[0].uuid;
    const category_id = req.body[0].category_id;
    await event.createUserIntoScores(uuid, category_id);

    //show selected quiz
    const quiz = await event.showSelectedQuiz(category_id);
    res.send(quiz)
});

//質問又はユーザー削除
router.get("/delete/:user_id", async (req, res) => {
    const user_id = req.params.user_id;

    //tableがユーザーだったら
    await event.deleteUser(user_id);
    return res.redirect('/admin');

    /*
    //tableがユーザーではなかったら
    await event.deleteQuestion(tablename, id);
    return res.redirect(`/quiz/${tablename}`);
    */
});

//質問更新画面へ
router.get("/update/:user_id", async (req, res) => {
    const user_id = req.params.user_id;

    return res.render('updateUser', {
        user_id: user_id 
    });

    /*
    const data = await event.selectedQuiz(tablename, id);
    return res.render('update', {
        selected: data[0],
        tablename: tablename
    });
    */
});

router.post("/updateuser/:user_id", async (req, res) => {
    const user_id = req.params.user_id;

  
});

//質問更新画面のポストフォームの処理
router.post("/:tablename/:id", async (req, res) => {
    const body = req.body;
    //console.log(updatedQuiz);
    const tablename = req.params.tablename;
    const id = req.params.id;

    if (tablename == "users") {
        await event.updatedUser(body, id);
        return res.redirect("/admin")
    }

    await event.updatedQuiz(body, tablename, id);
    res.redirect(`/quiz/${tablename}`);
});

module.exports = router;