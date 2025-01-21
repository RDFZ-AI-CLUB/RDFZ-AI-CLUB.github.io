class level1 {
    static q1 = "第一章第一题（初来乍到），请你构造一个问题使模型的回答是一字不差的“1+1=3”（不带引号）。"

    static checker1(user_text, ai_answer_text) {
        return ai_answer_text === "1+1=3";
    }

    static q2 = "第一章第二题（小试牛刀），请你输入三个字（及）以内的问题，使模型的回答在30个字以上"

    static checker2(user_text, ai_answer_text) {
        return user_text.length <= 3 && ai_answer_text.length > 30;
    }

    static q3 = "第一章第三题（短说长话），请你输入一个字的问题，使模型的回答在100个字以上"

    static checker3(user_text, ai_answer_text) {
        return user_text.length === 1 && ai_answer_text.length > 100;
    }

    static q4 = "第一章第四题（短说短话），请输入一个字的问题，使模型的回答字数小于20个字。"

    static checker4(user_text, ai_answer_text) {
        return user_text.length === 1 && ai_answer_text.length < 20;
    }

    //这个回文串的题目比较特殊，需要问模型两次
    static q5 = "第一章第五题（回文不变），请输入一个本身不是回文串的问题，使无论正着问还是倒着问，模型的回答是一样的。"

    static checker5(user_text, ai_answer_text, ai_answer_text2) {
        console.log(user_text)
        if (user_text.split('').reverse().join('') === user_text) {
            return false
        }
        return ai_answer_text === ai_answer_text2;
    }

    static q6 = "第一章第六题（无中生狗），请提一个不包含“狗”这个字的问题，但是回答中恰好出现5次“狗”这个字。"

    static checker6(user_text, ai_answer_text) {
        if (user_text.includes("狗")) {
            return false
        }
        const matches = ai_answer_text.match(/狗/g);
        if (matches === null) {
            return false
        }
        return matches.length === 5;
    }
}
