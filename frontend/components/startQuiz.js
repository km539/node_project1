import {
    randomNumber,
    getQuestion,
    increseCountByOne,
    counter,
} from "./utils.js";
export let questions = [];
const qs = document.getElementById("question");
let quizForm = document.getElementById("questions");

export async function fetchQuiz(url) {
    try {
        const res = await fetch(url, {
            method: 'get'
        });
        if (res.ok) {
            console.log('Click was recorded');
        }
        const data = await res.json();

        const formatedQuestionData = await formatQuestion(data);

        return formatedQuestionData;
    } catch (error) {
        console.log(error);
    }
}

async function formatQuestion(data) {
    console.log("pg data is received");
    //受け取ったデータをquestionsに格納
    questions = data;
    //ランダム番号を生成
    const randomNum = randomNumber(questions.length);
    const question = getQuestion(questions, randomNum);

    //四択形式クイズ表示
    showQuiz(question, counter);

    await increseCountByOne();

    return "Yes ....";
};

//問題を見せる
function showQuiz(question, counter) {
    qs.innerHTML = "Q" + counter + "  " + question.question;
    const qsNum = "Q" + counter;
    for (let i = 0; i < question.choise.length; i++) {

        //create div contains radio input.
        const element = question.choise[i];
        let div = document.createElement("DIV");
        div.setAttribute("id", "radioBox");

        let input = document.createElement("INPUT");
        input.setAttribute("type", "radio");
        input.setAttribute("name", qsNum);
        input.setAttribute("value", element);
        input.setAttribute("label", element);
        input.setAttribute("class", `choice${i}`);

        div.appendChild(input);
        quizForm.appendChild(div);
    }
}