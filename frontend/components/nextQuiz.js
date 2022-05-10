import {
    randomNumber,
    getQuestion,
    nextQuiz,
    counter,
    increseCountByOne,
    targetNum
} from "./utils.js";
const btnNextQuiz = document.getElementById('nextQuiz');
const btnSubmit = document.getElementById('submitBtn');

export async function nextButtonFunction(questions) {
    //チェックされた要素を取得して、その結果を保持する。
    var choice = document.querySelector("#radioBox input:checked");
    if (choice != null) {
        choice.checked = false;
    }
 
    //生成された番号のインデックスを削除
    questions.splice(targetNum, 1);

    if (0 < questions.length) {
        console.log("move to next question");
        const randomNum = randomNumber(questions.length);
        const question = getQuestion(questions, randomNum);

        nextQuiz(question, counter);
        await increseCountByOne(counter);
    }

    //最後の問題になったらサブミットボタンを表示
    if (1 == questions.length) {
        btnNextQuiz.style.display = "none";
        btnSubmit.style.display = "block";
    }
}