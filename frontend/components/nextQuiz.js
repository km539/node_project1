export function showNextQuiz(quizByCategory, turn) {
    //チェックされた要素を取得して、その結果を保持する。
    var checkedchoice = document.querySelector("#radioBox input:checked");
    if (checkedchoice != null) {
        checkedchoice.checked = false;
    }

    const qsNum = `Q${turn}`;
    const choice = quizByCategory[turn - 1].choice;
    document.getElementById("question").innerHTML = qsNum + "  " + quizByCategory[turn - 1].question;

    const div = document.querySelectorAll('#radioBox');
    for (let i = 0; i < choice.length; i++) {
        const input = div[i].firstElementChild;
        input.setAttribute("name", qsNum);
        input.setAttribute("value", `${i}`);
        input.setAttribute("label", choice[i]);
    }

    if (turn === quizByCategory.length) {
        document.getElementById('nextQuiz').style.display = "none";
        document.getElementById('submitBtn').style.display = "block";
    }
    return;
}