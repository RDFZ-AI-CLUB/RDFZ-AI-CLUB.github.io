window.currentLevel = 1;
window.currentQuestion = 1;
window.isSecondRequest = false;
window.firstAIMessageOnSecondRequest="";
window.userTextForl4q1="";

questionNumberOfLevels = {
    "1":6,
    "2":6,
    "3":4,
    "4":3,
    "5":2,
    "6":1
}

function onFail(){
    document.getElementById("onFail").style.display="block";
    setTimeout(()=>{
        document.getElementById("onFail").style.display="none";
    },3000)
}

function onSuccess(){
    document.getElementById("onSuccess").style.display="block";
}

function onWin(){
    document.getElementById("onWin").style.display="block";
}

//重置对话内容,清除界面上的记录并重置AI的记忆
function resetDialog(){
    messages = [];
    displayMessages = [];
}

function saveProgress(){
    setCookie("progress",JSON.stringify({
        level: window.currentLevel,
        q: window.currentQuestion
    }),365)
}

//清除对新手的提示
function clearTips(){
    const userInput = document.getElementById("userInput");
    userInput.placeholder = "请输入您的消息..."
}

function loadProgress(){
    try {
        if (getCookie("progress") === "") {
            return;
        }
        clearTips();
        const pg = JSON.parse(getCookie("progress"))
        window.currentLevel = pg.level;
        window.currentQuestion = pg.q;
        if (getCookie("win") === "1") {
            onWin();
        }
    }catch (e) {
        console.log(e);
    }
}

//检查是否解答成功，成功则跳转下一题
function checkCurrentQuestion(userText,aiMessage){
    //level4_q1是特殊的问题，需要单独的逻辑处理
    if (window.currentLevel===4 && window.currentQuestion===1){
        if (isSecondRequest){//问完第二次问题，开始检测答案是否正确
            eval(`result = level${window.currentLevel}.checker${window.currentQuestion}(window.userTextForl4q1,aiMessage)`);
            window.isSecondRequest = false;
            //这里直接执行到if (result){}那个语句
        }else {
            window.userTextForl4q1 = userText;
            const userInput = document.getElementById('userInput');
            userInput.value = aiMessage;
            sendMessage();//用AI的回答问第二次
            window.isSecondRequest = true;
            return;
        }
    }
    //level1_q5是特殊的问题，需要单独的逻辑处理
    if (window.currentLevel===1 && window.currentQuestion===5){
        if (isSecondRequest){//问完第二次问题，开始检测答案是否正确
            eval(`result = level${window.currentLevel}.checker${window.currentQuestion}(userText,window.firstAIMessageOnSecondRequest,aiMessage)`);
            window.isSecondRequest = false;
            //这里直接执行到if (result){}那个语句
        }else {
            const userInput = document.getElementById('userInput');
            userInput.value = userText.split('').reverse().join('');
            sendMessage();//反转问题问第二次
            window.isSecondRequest = true;
            window.firstAIMessageOnSecondRequest = aiMessage;
            return;
        }
    }
    if (!(window.currentLevel===1 && window.currentQuestion===5) && !(window.currentLevel===4 && window.currentQuestion===1)) {
        eval(`result = level${window.currentLevel}.checker${window.currentQuestion}(userText, aiMessage)`);
    }
    if (result){
        if (window.currentQuestion === questionNumberOfLevels[window.currentLevel]){
            if (window.currentLevel === 6){
                setCookie("win","1",365);
                onWin();
                return;
            }
            window.currentLevel++;
            window.currentQuestion = 1
        }else {
            window.currentQuestion++;
        }
        onSuccess();
        saveProgress();
        clearTips();
        resetDialog();
    }else{
        onFail();
        resetDialog();
    }
}

function loadQuestion() {
    eval(`qText = level${window.currentLevel}.q${window.currentQuestion}`);//获取题目字符串
    const questionWidget = document.getElementById('riddlesQuestion');
    questionWidget.innerText = qText;
}

loadProgress();
loadQuestion();
