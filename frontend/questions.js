const topicTitle = document.getElementById('topicTitle');
const btnNextQuiz = document.getElementById('nextQuiz');
const errorMessage = document.querySelector('.error');
const btns = document.querySelectorAll('.categoryBtn');
let quizByCatgory = []
const qs = document.getElementById("question");
let quizForm = document.getElementById("questions");
let turn = 1;


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
            const firstQs = showfirstQuestion(quiz);
            turn++;
            element.style.display = "none";
            document.querySelector("#category").setAttribute("value", element.name);
            initialClock();
        }

    });
    //element.style.display = "none";
}


async function postData(uuid, category_id) {
    try {
        const res = await fetch('/admin/update/scores', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                uuid: uuid,
                category_id: category_id
            }])
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//問題を見せる
function showfirstQuestion(quiz) {

    const qsNum = 'Q1';
    const choice = quiz[0].choice;
    qs.innerHTML = qsNum + "  " + quiz[0].question;
    for (let i = 0; i < choice.length; i++) {

        //create div contains radio input.
        const element = choice[i];
        let div = document.createElement("DIV");
        div.setAttribute("id", "radioBox");

        let input = document.createElement("INPUT");
        input.setAttribute("type", "radio");
        input.setAttribute("name", qsNum);
        input.setAttribute("value", `${i}`);
        input.setAttribute("label", element);
        input.setAttribute("class", `${i}`);

        div.appendChild(input);
        quizForm.appendChild(div);
        btnNextQuiz.style.display = "block";
    }
    return;
}

//ネクストボタンがクリックされたら…
btnNextQuiz.addEventListener('click', async (e) => {
    e.preventDefault();
    stopClock(); //前のタイマーをストップ
    showNextQuiz(); //次の問題を反映させる処理
    initialClock(); //
});

function showNextQuiz() {
    //チェックされた要素を取得して、その結果を保持する。
    var checkedchoice = document.querySelector("#radioBox input:checked");
    if (checkedchoice != null) {
        checkedchoice.checked = false;
    }

    const qsNum = `Q${turn}`;
    const choice = quizByCatgory[turn - 1].choice;
    qs.innerHTML = qsNum + "  " + quizByCatgory[turn - 1].question;

    const div = document.querySelectorAll('#radioBox');
    //console.log(div);
    for (let i = 0; i < choice.length; i++) {
        const input = div[i].firstElementChild;
        input.setAttribute("name", qsNum);
        input.setAttribute("value", `${i}`);
        input.setAttribute("label", choice[i]);
    }

    if (turn === quizByCatgory.length) {
        document.getElementById('nextQuiz').style.display = "none";
        document.getElementById('submitBtn').style.display = "block";
    }
    turn++;
    return;
}
//カウントダウンタイマー
const timer = document.querySelector(".displayTime");
const circle = document.querySelector(".circle");
var startTimer;

function initialClock() {
    circle.style.visibility = 'visible';
    let time = 30;
    startTimer = setInterval(() => {
        timer.innerHTML = `${time}`;
        time--;
        if (time < 0) {
            stopClock();
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