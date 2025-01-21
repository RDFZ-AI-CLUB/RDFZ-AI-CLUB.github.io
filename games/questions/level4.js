class level4 {
    static q1 = "第四章第一题（循环往复），请构造一个问题A，它的回复是不同于A的B，然后以B提问能再次得到A。"

    static checker1(user_textA, ai_answer_textA) {
        //user_textA是第一次构造的问题, ai_answer_textB是模型对user_textA的回答(判断的时候不需要这个值), ai_answer_textA是模型对ai_answer_textB的回答
        //ai_answer_textA与user_textA相同即为过关
        return user_textA === ai_answer_textA;
    }

    static q2 = "第四章第二题（中国万岁），请输入一个字的问题，使模型的回答中包含“中国”或“China”(C必须大写)"

    static checker2(user_text, ai_answer_text) {
        if (user_text.length === 1){
            return ai_answer_text.includes("中国") || ai_answer_text.includes("China");
        }
        return false;
    }

    static q3 = "第四章第三题（自然之密），请输入一个大于一的正整数作为问题，使回答里包含和它刚好相差1的数。"

    static checker3(user_text, ai_answer_text) {
        if (extractInteger(user_text) !== false) {
            const r = extractInteger(user_text);
            if (r !== false && r > 1) {
                return ai_answer_text.includes((r+1).toString()) || ai_answer_text.includes((r-1).toString());
            }
            return false;
        }
        return false;
    }
}
