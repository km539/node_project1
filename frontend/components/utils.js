const qs = document.getElementById("question");

/*
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
*/
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