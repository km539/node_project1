import {
    fetchQuiz,
    questions
} from "./components/startQuiz.js";
import {
    nextButtonFunction
} from "./components/nextQuiz.js";
import {
    targetNum,
    counter,
    checkUserDoneQuiz
} from "./components/utils.js";

const topicTitle = document.getElementById('topicTitle');
const japana = document.getElementById('japana');
const categoryb = document.getElementById('categoryb');
const username = document.getElementById('username').value;
const btnNextQuiz = document.getElementById('nextQuiz');
const errorMessage = document.querySelector('.error');

japana.addEventListener('click', async (e) => {
    e.preventDefault();
    errorMessage.innerHTML = '';
    const value = await checkUserDoneQuiz(username, 'japana')
    if (value) {
        errorMessage.innerHTML = value;
    } else {
        const url = `/admin/user/${username}/japana`;
        document.querySelector("#category").setAttribute("value", "japana");
        await categoryBtnAction(url);
    }
});

categoryb.addEventListener('click', async (e) => {
    e.preventDefault();
    errorMessage.innerHTML = '';
    const value = await checkUserDoneQuiz(username, 'japana')
    if (value) {
        errorMessage.innerHTML = value;
    } else {
        const url = `/admin/user/${username}/categoryb`;
        document.querySelector("#category").setAttribute("value", "categoryb");
        await categoryBtnAction(url);
    }
});

async function categoryBtnAction(url) {
    await fetchQuiz(url);

    btnNextQuiz.style.display = "block";
    japana.style.display = "none";
    categoryb.style.display = "none";
    topicTitle.style.display = "none";

    initialClock();
}

//ネクストボタンがクリックされたら…
btnNextQuiz.addEventListener('click', async (e) => {
    e.preventDefault();
    stopClock(); //前のタイマーをストップ
    await nextButtonFunction(questions); //次の問題を反映させる処理
    initialClock(); //
});

//カウントダウンタイマー
const timer = document.querySelector(".displayTime");
const circle = document.querySelector(".circle");
var startTimer;

function initialClock() {
    circle.style.visibility = 'visible';
    let time = 30;
    startTimer = setInterval(async () => {
        timer.innerHTML = `${time}`;
        time--;
        if (time < 0) {
            stopClock();
            saveSelectedQuestion();
            if (questions.length == 1) { //クイズが最後の問題だったら
                circle.style.visibility = 'hidden';

                //ポストフォームをリクエスト
                document.forms.reviewForm.submit();
            } else {
                console.log("time is up");
                await nextButtonFunction(questions);
                initialClock();
            }
        }
    }, 1000);
}

function stopClock() {
    clearInterval(startTimer);
    startTimer = null;
    timer.innerHTML = '';
};
//選んだ選択肢を確認する
const correct = 1;
const wrong = 0;
let answeredquestion = '';
for (let i = 0; i < questions.length; i++) {
    answeredquestion += 'x';
}
const form = document.querySelector("#form");
form.addEventListener('change', saveSelectedQuestion);

function saveSelectedQuestion() {
    const choice = document.querySelector("#radioBox input:checked");
    let result = wrong;
    let num = counter - 1;
    if (choice) {
        result = choice.value == questions[targetNum].answer ? correct : wrong;
        num = choice.name.substring(1) - 1;
    }

    if (answeredquestion - 1 == num) {
        answeredquestion = answeredquestion.substring(0, num) + result;
    } else {
        answeredquestion = answeredquestion.substring(0, num) + result + answeredquestion.substring(num + 1);
    }

    //htmlフォームのインプットに選択された回答を渡すはず…
    document.querySelector("#selectedChoices").setAttribute("value", answeredquestion);
}