const qs = document.getElementById("question");
export let counter = 1;
export let targetNum = 0

//問題のレングスをパラメータとして取得
export function randomNumber(para) {
    targetNum = Math.floor(Math.random() * para);
    return targetNum;
}

//四択形式クイズ内容変更
export function nextQuiz(question, counter) {
    qs.innerHTML = "Q" + counter + "  " + question.question;
    const qsNum = "Q" + counter;
    for (let i = 0; i < question.choise.length; i++) {
        const input = document.querySelector(`.choice${i}`);
        input.setAttribute("name", qsNum);
        input.setAttribute("value", question.choise[i]);
        input.setAttribute("label", question.choise[i]);
    }
}

//クイズのフォーマットに変数を作成
export function getQuestion(questions, randomNum) { // formatQuestion?
    return {
        id: questions[randomNum].id,
        question: questions[randomNum].question,
        choise: [
            questions[randomNum].choice1,
            questions[randomNum].choice2,
            questions[randomNum].choice3,
            questions[randomNum].choice4
        ],
        answer: questions[randomNum].answer
    };
}

//カウンター
export async function increseCountByOne() {
    return counter++;
}

//ユーザーがクリックしたクイズをうけたことがあるから確認
export async function checkUserDoneQuiz(username, category) {
    try {
        const res = await fetch(`/check/${username}/${category}`, {
            method: 'get'
        })
        const data = await res.json()

        //クイズをしたことがあったらエラーメッセージをみせる
        const msg = () => {
            if (data.score != null) {
                return '同じクイズは一人一回です。';
            }
            return  '';
        };
        
        return msg();

    } catch (error) {
        console.log(error);
    }

}