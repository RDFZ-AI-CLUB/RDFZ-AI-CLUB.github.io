class level6 {
    static q1 = "第六章第一题（勇于说不），请构造一个十字以上的问题，在不提到“不”(英文单词'NO'也不可以)的情况下，让模型只输出“不”字。"

    static checker1(user_text, ai_answer_text) {
        if (user_text.length > 10 && !(user_text.includes("不"))){
            if (user_text.toLowerCase().includes("no")){
                return false;
            }
            return ai_answer_text === "不";
        }
        return false;
    }
}
