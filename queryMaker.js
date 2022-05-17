const postgresDB = require('./postgres/connectDB');
const bcrypt = require("bcrypt"); //for hashing password

function createUserIntoScores(uuid, category_id) {
    const startTime = Date.now(); //開始時間
    const para = {
        text: `insert into scores (start_time, user_id, category_id) values($1,$2,$3)`,
        values: [startTime, uuid, category_id]
    }
    return postgresDB.getData(para);
}

function showSelectedQuiz(category_id) {
    const para = `select id, question, choice, answer from questions where category_id = ${category_id} ORDER BY random() limit 10`;
    return postgresDB.getData(para);
}

async function checkAnswer(user_id, category, userAnswers) {

    const totalAns = userAnswers.length;
    let correctAns = 0;
    for (let i = 0; i < totalAns; i++) {
        if (userAnswers[i] == 1) {
            correctAns++;
        }
    }
    const wrongAns = totalAns - correctAns;
    const score = Math.floor(correctAns * (100 / totalAns)); // 100/ 0
    const status = score >= 70 ? "PASS" : "FAIL";

    //終わった時間,合否と結果を更新
    const endTime = Date.now();
    const para = {
        text: `update scores set score = $1, status = $2, end_time = $3 where user_id = $4 and category_id = $5`,
        values: [score, status, endTime, user_id, category]
    };

    //ユーザーテーブルを更新
    await postgresDB.getData(para);

    //かかった時間を計算するために開始時間と終了時間を取得
    const para1 = {
        text: `select * from scores where user_id = $1 and category_id = $2`,
        values: [user_id, category]
    };
    const ansTime = await postgresDB.getData(para1);
    const ans = Math.floor((ansTime[0].end_time - ansTime[0].start_time) / 1000);

    //かかった時間を更新
    const para2 = {
        text: `update scores set taken_time = $1 where user_id = $2 and category_id = $3`,
        values: [ans, user_id, category]
    };
    await postgresDB.getData(para2);

    return userResult = {
        score,
        totalAns,
        correctAns,
        wrongAns,
        ans,
        status
    };
}

function addQuestionByCategory(question,choices,ansNum,category_id) {
    const para = {
        text: `insert into questions(question, choice, answer, category_id)  values ($1,$2,$3,$4)`,
        values: [question,choices,ansNum,category_id]
    }
    return postgresDB.getData(para);
}

function addNewCategory(category){
   const para = `insert into categories(category_name) values ('${category}')`;
   return postgresDB.getData(para);
}

function showQuestiontable(category) {
    const para = `select * from questions where category_id = ${category}`;
    return postgresDB.getData(para);
}

function getUser(id) {
    //if parametar value is uuid
    if (id.length >= 10) {
        const para = {
            text: `select * from users where id = $1`,
            values: [id]
        }
        return postgresDB.getData(para);
    }
    const para = {
        text: `select * from users where user_name = $1`,
        values: [id]
    }
    return postgresDB.getData(para);
}

function getUserScore(id) {
    const para = {
        text: `select * from scores where user_id = $1`,
        values: [id]
    }
    return postgresDB.getData(para);
}

function checkUserCategoryScore(username, category) {
    const para = {
        text: `select score from score where user_name = $1 and category = $2`,
        values: [username, category]
    }
    return postgresDB.getData(para);
}

async function addNewUser(newUserInfo) {

    const user = await getUser(newUserInfo.name);

    //同じ名前のユーザーがいるかの確認
    if (user.length !== 0) {
        return 0;
    }
    //パスと確認用のパスが一致しているかの確認
    if (newUserInfo.pw1 !== newUserInfo.pw2) {
        return 1;
    }

    //パスワードをエンクリプト化
    const hashedPw = bcrypt.hashSync(newUserInfo.pw1, 5);

    //userターブルに新規ユーザー追加
    //const id = String(Math.floor(Math.random() * 10000000));
    const para = {
        text: "insert into users (user_name,user_pw,user_role) values ($1,$2,0)",
        values: [newUserInfo.name, hashedPw]
    }
    return postgresDB.getData(para);
}

async function loginUser(loginUserInfo) {
    const data = await getUser(loginUserInfo.name);

    //user account doesn't exist.
    if (data.length === 0) {
        return 0;
    }

    //エンクリプトパスワードとユーザーからのパスワードを比較
    const result = bcrypt.compareSync(loginUserInfo.pw1, data[0].user_pw);

    //パスワードが一致すればユーザーデータを返す
    if (result) {
        if (data[0].user_role === 1) {
            return 2;
        }
        return data;
    }

    return 1;
}

function getAllUsers() {
    const para = "select * from users";
    return postgresDB.getData(para);
}

function getAllCategory() {
    const para = "select * from categories";
    return postgresDB.getData(para);
}

function getAnsweredQuiz(uuid){
    const para = {
        text: `select category_id from scores where user_id = $1`,
        values: [uuid]
    }
    return postgresDB.getData(para);
}

async function deleteUser(id) {
    const para2 = {
        text: `delete from scores where user_id = $1`,
        values: [id]
    }
    await postgresDB.getData(para2);

    //ユーザーテーブルにあるユーザーのデータを削除
    const para = {
        text: `delete from users where id = $1`,
        values: [id]
    }
    return await postgresDB.getData(para);
}

function selectedQuiz(tablename, id) {
    const para = {
        text: `select * from $1 where id = $2`,
        values: [tablename, id]
    }
    return postgresDB.getData(para);
}

function updatedUser(userinfo, username) {
    const updPara = {
        text: `update users set user_name=$1, status=$2 where user_name = $3`,
        values: [userinfo.username, userinfo.status, username]
    }
    return postgresDB.getData(updPara);
}
module.exports = {
    checkAnswer,
    checkUserCategoryScore,
    addQuestionByCategory,
    showQuestiontable,
    addNewUser,
    addNewCategory,
    loginUser,
    deleteUser,
    updatedUser,
    selectedQuiz,
    getUser,
    getAllUsers,
    getAllCategory,
    getAnsweredQuiz,
    getUserScore,
    createUserIntoScores,
    showSelectedQuiz
}