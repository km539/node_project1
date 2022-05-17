import {postData, showfirstQuestion} from './components/startQuiz.js';
import {showNextQuiz} from './components/nextQuiz.js';

const btnNextQuiz = document.getElementById('nextQuiz');
const errorMessage = document.querySelector('.error');
const btns = document.querySelectorAll('.categoryBtn');
let quizByCatgory = [] //クイズの問題を確保
let turn = 1; //クイズの番号


//カテゴリーボタンがクリックされる処理
for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    element.addEventListener('click', async (e) => {
        e.preventDefault();

        if (element.name !== null) {
            //クイズデータ取得
            const quiz = await postData(element.value, element.name);
            //console.log(quiz);
            quizByCatgory = quiz;
            //カテゴリボタンを非表示にする。
            for (let j = 0; j < btns.length; j++){
                btns[j].style.display = "none";
            }
            const firstQs = showfirstQuestion(quiz);
            turn++;
            document.querySelector("#category").setAttribute("value", element.name);
            initialClock();
        }

    });
}

//ネクストボタンがクリックされたら…
btnNextQuiz.addEventListener('click', async (e) => {
    e.preventDefault();
    stopClock(); //前のタイマーをストップ
    showNextQuiz(quizByCatgory, turn ); //次の問題を反映させる処理
    turn++;
    initialClock(); //
});


//カウントダウンタイマー
const timer = document.querySelector(".displayTime");
const circle = document.querySelector(".circle");
var startTimer;
function initialClock() {
    circle.style.visibility = 'visible';
    let time = 10;
    startTimer = setInterval(() => {
        timer.innerHTML = `${time}`;
        time--;
        if (time < 0) {
            stopClock();
            saveSelectedQuestion(quizByCatgory, turn );
            turn++;
            if (turn - 1 === quizByCatgory.length) { //クイズが最後の問題だったら
                circle.style.visibility = 'hidden';

                //ポストフォームをリクエスト
                document.forms.reviewForm.submit();
            } else {
                console.log("time is up");
                showNextQuiz();
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
for (let i = 0; i < quizByCatgory.length; i++) {
    answeredquestion += 'x';
}
const form = document.querySelector("#form");
form.addEventListener('change', saveSelectedQuestion);

function saveSelectedQuestion() {
    const choice = document.querySelector("#radioBox input:checked");
    let result = wrong;
    let num = turn - 2;
    if (choice) {
        result = choice.value == quizByCatgory[num].answer ? correct : wrong;
        num = choice.name.substring(1) - 1;
    }

    if (answeredquestion - 1 == num) {
        answeredquestion = answeredquestion.substring(0, num) + result;
    } else {
        answeredquestion = answeredquestion.substring(0, num) + result + answeredquestion.substring(num + 1);
    }

    //htmlフォームのインプットに選択された回答を渡すはず…
    document.querySelector("#selectedChoices").setAttribute("value", answeredquestion);
    return;
}