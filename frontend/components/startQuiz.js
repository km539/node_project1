const qs = document.getElementById("question");
let quizForm = document.getElementById("questions");

export async function postData(uuid, category_id) {
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

//最初の問題を見せる
export function showfirstQuestion(quiz) {

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
        document.getElementById('nextQuiz').style.display = "block";
        document.getElementById('topicTitle').style.display = "none";
    }
    return;
}