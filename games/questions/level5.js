class level5 {
    static q1 = "第五章第一题（口是心非），请构造一个不少于十个字的问题，使得回答中不包含问题中的任何字符。"

    //遍历问题字符串，检查是否每个字都不在回答中
    static checker1(user_text, ai_answer_text) {
        if (user_text.length > 10){
            for (const char of user_text){
                if (ai_answer_text.includes(char)){
                    return false;
                }
            }
            return true;
        }
        return false;
    }


    static q2 = "第五章第二题（口非心是），请构造一个不少于十个字的问题，使得回答在不重复问题的句子的情况下，包含问题中的所有字符。"

    //遍历问题字符串，检查是否每个字都在回答中
    static checker2(user_text, ai_answer_text) {
        if (user_text.length > 10){
            for (const char of user_text){
                if (!ai_answer_text.includes(char)){
                    return false;
                }
            }
            return !ai_answer_text.includes(user_text);
        }
        return false;
    }
}
