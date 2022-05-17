const qs = document.getElementById("question");

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