const express = require("express");
const router = express.Router();
const event = require('../queryMaker');
const ROOT = require("../constants");

//管理者画面ページ
router.get("/", async (req, res) => {
    const data = await event.getAllUsers();
    return res.render('admin', {
        users: data
    });
});

//add new question into table
router.post("/", async (req, res) => {
    const body = req.body;
    await event.addQuestion(body);
});

//質問又はユーザー削除
router.get("/delete/:tablename/:id", async (req, res) => {
    const tablename = req.params.tablename;
    const id = req.params.id;

    //tableがユーザーだったら
    if (tablename == 'users') {
        await event.deleteUser(tablename, id);
        return res.redirect('/admin');
    }

    //tableがユーザーではなかったら
    await event.deleteQuestion(tablename, id);
    return res.redirect(`/quiz/${tablename}`);
});

//質問更新画面へ
router.get("/update/:tablename/:id", async (req, res) => {
    const tablename = req.params.tablename;
    const id = req.params.id;

    //tableがユーザーだったら
    if (tablename == 'users') {
        return res.render('updateUser', {
            username  : id
        });
    }

    const data = await event.selectedQuiz(tablename, id);
    return res.render('update', {
        selected: data[0],
        tablename: tablename
    });
});

//質問更新画面のポストフォームの処理
router.post("/:tablename/:id", async (req, res) => {
    const body = req.body;
    //console.log(updatedQuiz);
    const tablename = req.params.tablename;
    const id = req.params.id;

    if(tablename == "users"){
        await event.updatedUser(body, id);
        return res.redirect("/admin")
    }

    await event.updatedQuiz(body, tablename, id);
    res.redirect(`/quiz/${tablename}`);
});

//開始時間更新
router.get("/user/:username/:categoryname", async (req, res) => {
    const category = req.params.categoryname;
    const username = req.params.username;
    //console.log("username : "+username+" category : "+category);
    const db = await event.updateStartTime(username, category);
    res.send(db);
});

module.exports = router;