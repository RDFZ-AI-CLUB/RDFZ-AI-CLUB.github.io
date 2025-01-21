class level3 {
    static q1 = "第三章第一题（自说自话），请你输入一个至少10个字的提问，使模型的回答和提问完全一样。"

    static checker1(user_text, ai_answer_text) {
        if (user_text.length >= 10){
            return user_text === ai_answer_text;
        }
        return false;
    }

    static q2 = "第三章第二题（话自说自），请你输入一个至少10个字的提问，使模型的回答是问题的反序。"

    static checker2(user_text, ai_answer_text) {
        if (user_text.length >= 10){
            return ai_answer_text === user_text.split('').reverse().join('');
        }
        return false;
    }

    static q3 = "第三章第三题（就是敢说），请你输入一个不包含“1”和“3”的提问，使模型的回答是一字不差的“1+1=3”（不需要引号）。"

    static checker3(user_text, ai_answer_text) {
        if (!(user_text.includes("1") || user_text.includes("3"))){
            return ai_answer_text === "1+1=3";
        }
        return false;
    }

    static q4 = "第三章第四题（RDFZ AI彩蛋），让模型的回答中同时包含“人大附中”和“人工智能”八个字(不要引号)"

    static checker4(user_text, ai_answer_text) {
        return ai_answer_text.includes("人大附中") && ai_answer_text.includes("人工智能")
    }
}
