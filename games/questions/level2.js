class level2 {
    static q1 = "第二章第一题（质数长度），你需要提出一个字数是质数的问题，使回答的长度刚好是它的下一个质数。"

    static checker1(user_text, ai_answer_text) {
        if (!isPrime(user_text.length)) {
            return false;
        }
        return ai_answer_text.length === nextPrime(user_text.length)
    }

    static q2 = "第二章第二题（越说越大），请输入一个大于一的正整数作为问题(不能有除数字以外的字符)，使回答里包含至少比它大一千的数。"

    static checker2(user_text, ai_answer_text) {
        if (extractInteger(user_text) === false || extractInteger(user_text) <= 1) {
            return false;
        }
        // 使用正则表达式匹配所有数字
        const numbers = ai_answer_text.match(/\d+/g);

        if (!numbers) return false; // 如果没有找到数字，返回 false

        // 检查是否有任何数字大于1000
        for (let num of numbers) {
            if (parseInt(num) > (extractInteger(user_text) + 1000)) {
                return true;
            }
        }

        return false;
    }

    static q3 = "第二章第三题（越说越小），请输入一个大于一的正整数作为问题(不能有除数字以外的字符)，使回答里包含至少10个至少比它小一千的自然数。"

    static checker3(user_text, ai_answer_text) {
        if (extractInteger(user_text) === false || extractInteger(user_text) <= 1) {
            return false;
        }
        // 使用正则表达式匹配所有数字
        const numbers = ai_answer_text.match(/\d+/g);
        let countOfNumbers = 0;

        if (!numbers) return false; // 如果没有找到数字，返回 false

        // 检查是否有任何数字大于1000
        for (let num of numbers) {
            if (parseInt(num) <= (extractInteger(user_text) - 1000)) {
                countOfNumbers++;
            }
        }

        return countOfNumbers >= 10;
    }

    static q4 = "第二章第四题（警世名言），请在不提及1,4,5这三个字符的情况下让模型回答114514，不要有多余的字符。"

    static checker4(user_text, ai_answer_text) {
        if (user_text.includes('1') || user_text.includes('4') || user_text.includes('5')) {
            return false;
        }
        return ai_answer_text === "114514";
    }

    static q5 = "第二章第五题（开平方数），请输入一个大于一的完全平方数作为问题(不能有除数字以外的字符)，使回答里包含它的算数平方根对应的数。"

    static checker5(user_text, ai_answer_text) {
        if (extractInteger(user_text) !== false) {
            const r1 = isPerfectSquare(extractInteger(user_text));
            if (r1 !== false && r1 !== 1) {
                return ai_answer_text.includes(r1.toString());
            }
            return false;
        }
        return false;
    }

    static q6 = "第二章第六题（得寸进狗），请提一个不包含“狗”这个字的10个字以内的问题，使回答中“狗”这个字出现的次数至少是问题字数的2倍。"

    static checker6(user_text, ai_answer_text) {
        if (!user_text.includes("狗") && user_text.length <= 10) {
            const matches = ai_answer_text.match(/狗/g);
            if (matches === null) {
                return false;
            }
            return matches.length >= 2 * user_text.length;
        }
        return false;
    }
}
