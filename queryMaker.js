const postgresDB = require('./postgres/connectDB');
const bcrypt = require("bcrypt"); //for hashing password

async function updateStartTime(username, category) {
    const startTime = Date.now();
    const para = {
        text: `update score set start_time = $1 
        where user_name = $2 and category = $3`,
        values: [startTime, username, category]
    }
    //ユーザーテーブルの開始時間を更新
    await postgresDB.getData(para);

    return showQuestiontable(category);
}

async function checkAnswer(category, username, userAnswers) {
    const db = await showQuestiontable(category);

    const totalAns = db.length;
    let correctAns = 0;
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] == 1) {
            correctAns++;
        }
    }
    const wrongAns = totalAns - correctAns;
    const score = correctAns * (100 / totalAns); // 100/ 0
    const status = score >= 70 ? "PASS" : "FAIL";

    //終わった時間と結果を更新
    const endTime = Date.now();
    const para = {
        text: `update score set end_time = $1, score = $2 
        where user_name = $3 and category = $4`,
        values: [endTime, score, username, category]
    };

    //ユーザーテーブルの終了時間を更新
    await postgresDB.getData(para);

    //かかった時間を計算するために開始時間と終了時間を取得
    const para1 = {
        text: `select start_time, end_time from score 
        where user_name = $1 and category = $2`,
        values: [username, category]
    };
    const ansTime = await postgresDB.getData(para1);
    const ans = Math.floor((ansTime[0].end_time - ansTime[0].start_time) / 1000);

    //かかった時間、合否を更新
    const para2 = {
        text: `update score set taken_time = $1, status = $2
        where user_name = $3 and category = $4`,
        values: [ans, status, username, category]
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

function addQuestion(body) {
    //auto increment based on primary key id
    const para = {
        text: `insert into ${body.topic}(question, choice1, choice2, choice3, choice4, answer) values ($1,$2,$3,$4,$5,$6)`,
        values: [body.question, body.choice1, body.choice2, body.choice3, body.choice4, body.answer]
    }
    return postgresDB.getData(para);
}

function showQuestiontable(tablename) {
    const para = `select * from ${tablename}`;
    return postgresDB.getData(para);
}

function getUser(username) {
    const para = {
        text: `select * from users where user_name = $1`,
        values: [username]
    }
    return postgresDB.getData(para);
}

function getUserScore(username) {
    const para = {
        text: `select * from score where user_name = $1`,
        values: [username]
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
    if(user.length !== 0){
        return 0;
    }
    //パスと確認用のパスが一致しているかの確認
    if(newUserInfo.pw1 !== newUserInfo.pw2){
        return 1;
    }

    //パスワードをエンクリプト化
    const hashedPw = bcrypt.hashSync(newUserInfo.pw1, 5);

    //userターブルに新規ユーザー追加
    const id = String(Math.floor(Math.random() * 10000000));
    const para = {
        text: "insert into users (user_name,user_pw,user_id,status) values ($1,$2,$3,'user')",
        values: [newUserInfo.name, hashedPw, id]
    }
    await postgresDB.getData(para);

    //スコアテーブルに新規ユーザー追加
    const para2 = {
        text: "insert into score (user_name, score, taken_time, status, category, start_time, end_time) values ($1,null,null,'NA',$2,null,null)",
        values: [newUserInfo.name, 'japana']
    }
    await postgresDB.getData(para2);

    const para3 = {
        text: "insert into score (user_name, score, taken_time, status, category, start_time, end_time) values ($1,null,null,'NA',$2,null,null)",
        values: [newUserInfo.name, 'categoryb']
    }
    await postgresDB.getData(para3);

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
        if (data[0].status == 'admin') {
            return 2;
        }
        return loginUserInfo.name;
    }

    return 1;
}

function getAllUsers() {
    const para = "select * from users";
    return postgresDB.getData(para);
}

function deleteQuestion(tablename, id) {
    /*
    const para = {
        text: `delete from ${tablename} where id = $1`,
        values: [id]
    }
    return postgresDB.getData(para);
    */ 
    const para = {
        text: `delete from $1 where id = $2`,
        values: [tablename, id]
    }
    return postgresDB.getData(para);
}

async function deleteUser(tablename, name) {
    //ユーザーテーブルにあるユーザーのデータを削除
    const para = {
        text: `delete from $1 where user_name = $2`,
        values: [tablename, name]
    }
    await postgresDB.getData(para);

    //スコアテーブルにあるユーザーのデータを削除
    const para2 = {
        text: `delete from score where user_name = $1`,
        values: [name]
    }
    await postgresDB.getData(para2);
}

function selectedQuiz(tablename, id) {
    const para = {
        text: `select * from $1 where id = $2`,
        values: [tablename, id]
    }
    return postgresDB.getData(para);
}

function updatedQuiz(updatedQuiz, tablename, id) {
    const updPara = {
        text: `update $1 set question=$2, choice1=$3, choice2=$4, choice3=$5, choice4=$6, answer=$7 where id = $8`,
        values: [tablename, updatedQuiz.qContent, updatedQuiz.qChoice1, updatedQuiz.qChoice2, updatedQuiz.qChoice3, updatedQuiz.qChoice4, updatedQuiz.qAnswer, id]
    }
    return postgresDB.getData(updPara);
}

function updatedUser(userinfo, username) {
    const updPara = {
        text: `update users set user_name=$1, status=$2 where user_name = $3`,
        values: [userinfo.username, userinfo.status, username]
    }
    return postgresDB.getData(updPara);
}
module.exports = {
    updateStartTime,
    checkAnswer,
    checkUserCategoryScore,
    addQuestion,
    showQuestiontable,
    addNewUser,
    loginUser,
    deleteQuestion,
    deleteUser,
    updatedQuiz,
    updatedUser,
    selectedQuiz,
    getUser,
    getAllUsers,
    getUserScore
}