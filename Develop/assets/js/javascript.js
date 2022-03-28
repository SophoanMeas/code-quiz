// create html tag
var body = document.body;
var wrapper = document.createElement("div");
var container = document.createElement("div");
var quiz_header = document.createElement("div");
var questions = document.createElement("div");
var high_score = document.createElement("p");
var timer = document.createElement("p");
var options = document.createElement("div");
var optionsLi = document.createElement("li");
var startButton = document.createElement("div");
var startQuizBtn = document.createElement("button");
var result = document.createElement("div");

// set class name
wrapper.className = "wrapper";
quiz_header.className = "quiz-header";
quiz_header.setAttribute("id", "quiz-header");
container.className = "container";
questions.className = "questions";
questions.setAttribute("id", "questions");
options.className = "options";
options.setAttribute("id", "options");
high_score.className = "high-score";
high_score.setAttribute("id", "high-score");
high_score.textContent = "View Highscore";
timer.className = "timer";

startButton.className = "start-button";
startQuizBtn.textContent = "Start Quiz";
startQuizBtn.setAttribute("type", "button");
startQuizBtn.setAttribute("id", "start-quiz");
result.className = "result";
result.setAttribute("id", "result");

var userInfo = [];

var totalNumQuestions = Object.keys(quizData).length - 1;

var counter = 0;
var nextQuestion = 0;
var score = 0;
var timeInterval;
var minutes = 19;
var seconds = 59;
timer.textContent = "20:00";

function start() {
    body.appendChild(wrapper);
    wrapper.appendChild(container);
    container.appendChild(quiz_header);
    quiz_header.appendChild(high_score);
    quiz_header.appendChild(timer);

    container.appendChild(questions);
    container.appendChild(questions);
    wrapper.appendChild(startButton);

    startButton.setAttribute("id", "start-button");
    document.getElementById("start-button").style.display = "block";
    startButton.appendChild(startQuizBtn);

    var clickable = document.querySelector(".quiz-header");
    clickable.setAttribute("style", "pointer-events: auto");

    let intro = `Try to answer the following code-related questions within the time limit.
    Keep in mind that incorrect answers will penalize your score time by ten seconds!`;

    document.getElementById("questions").innerHTML = `
       <div class="splash-screen"><h1 class="title">Coding Quiz Challenge</h1><h2>${intro}</h2></div> 
    `;
}

function quizTimer() {
    timeInterval = setInterval(() => {
        if (seconds === 0) {
            minutes--;
            seconds = 60;
        }

        timer.textContent = `${minutes}:${seconds}`;
        seconds--;

        if (minutes <= 0) {
            timer.textContent = `${minutes}:00`;
            clearInterval(timeInterval);
            finishPage();
        }
    }, 1000);
}

// load question
function loadQuestions(data, i) {
    var clickable = document.querySelector(".quiz-header");
    clickable.setAttribute("style", "pointer-events: none");
    const question = data[i].question;
    const multiChoiceList = data[i].opt;

    container.appendChild(questions);
    document.getElementById("questions").innerHTML = `
            ${question}`;
    // display the multiple choice
    questions.appendChild(options);
    document.getElementById("options").innerHTML = `
    <ul>     
    ${multiChoiceList
      .map(
        (multiChoiceList, index) => `
            <li> ${charCode(index + 1)} ${multiChoiceList} </li>
        `
      )
      .join("")}
    </ul>`;
}

// check answer
function checkAnswer(data, element, nextQuestion) {
    wrapper.appendChild(result); // show correct answer
    var delayTime = 1000;
    var options = element.textContent.slice(3);

    wrapper.appendChild(result);
    result.setAttribute("style", "border-top: 3px solid rgb(122, 122, 122)");

    result = document.querySelector(".result");

    if (options.match(data[nextQuestion].answer)) {
        correctAnswer(result);
    } else {
        wrongAnswer(result);
    }
    setTimeout(function () {

        timer.setAttribute("style", "color:black;");
        document.querySelector(".questions").remove();
        document.querySelector(".result").remove();
        // }else{
        //     clearInterval(timeInterval);
        //     finishPage()

        run();
    }, delayTime);
}

function correctAnswer() {
    result.textContent = "Correct";
    score++;
}

function wrongAnswer() {
    result.textContent = "WRONG!";
    timer.append(":   -10secs");
    timer.setAttribute("style", "color:red;");

    if (seconds >= 10) {
        seconds -= 10;
    }
}

function finishPage() {
    clearInterval(timeInterval);
    document.querySelector(".questions").remove();
    var clickable = document.querySelector(".quiz-header");
    clickable.setAttribute("style", "pointer-events: none");
    var finishPage = document.createElement("div");
    container.appendChild(finishPage);
    finishPage.className = "finish-page";

    document.querySelector(".finish-page").innerHTML = `
    <form class="done-page"><h2>All done!</h2>
    <br><p class="done-page-score">Your final score is ${score}/${totalNumQuestions}.</p>
    <br>
    <label for="initials">Enter initials:</label>
    <input type="text" id="initials" placeholder="enter your initial">
    <button type="button" class="submit-btn" id='submit-btn' value="click" onclick='saveData();'>Submit</button>
    </form>`;

    var submit = document.querySelector(".submit-btn");
    submit.addEventListener("click", highScorePage);
}

function highScorePage() {

    document.querySelector(".quiz-header").remove();
    document.querySelector(".finish-page").remove();
    var highScorePage = document.createElement("div");
    container.appendChild(highScorePage);
    highScorePage.className = "highscore-page";

    document.querySelector(".highscore-page").innerHTML = `
    <form class="highscore-page"><h2>Highscores</h2>
    <br><p class="highscore" id='highscore'>${userInfo
      .map(
        (user) => `
    ${user.player}. ${user.initials} - ${user.highscore}/${totalNumQuestions} 
                `
      )
      .join("<br>")} </p>
    <br>
    <button type="button" class="highscore-btn" id='highscore-btn' value="click" onclick='goBack();'>Go Back</button>
    <button type="button" class="highscore-btn" id='highscore-btn' value="click" onclick='clearHighScores();'>Clear Highscores</button>
    </form>`;
    // show

    localStorage.clear();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log(userInfo);
}

function saveData() {
    var tempInitials = document.getElementById("initials").value;
    counter += 1;

    const tempUserInfo = {
        player: counter,
        initials: tempInitials,
        highscore: score,
    };

    userInfo.push(tempUserInfo);
    // console.log(userInfo)
}

function clearHighScores() {
    var score = document.querySelector(".highscore")

    if (score === null) {
        return
    } else {
        score.remove();
    }

    for (var key in userInfo) {
        if (userInfo.hasOwnProperty(key)) delete userInfo[key];
    }
    userInfo.length = 0;
    counter = 0;
    localStorage.clear();
}

function goBack() {
    document.querySelector(".highscore-page").remove();
    nextQuestion = 0;
    timer.textContent = "20:00";
    minutes = 19;
    seconds = 59;
    score = 0;
    start();
}

// return letter A, B, C, D for the multiplechoice
function charCode(i) {
    return String.fromCharCode(i + 64)
        .concat(") ")
        .toLocaleLowerCase();
}

// remove contents
function removeContents() {
    document.querySelector(".questions").remove();
}

function run() {

    loadQuestions(quizData, nextQuestion);

    if (nextQuestion === totalNumQuestions) {
        finishPage();
    }
}

startButton.addEventListener("click", function () {
    document.getElementById("start-button").style.display = "none";
    //   finishPage();
    quizTimer();
    removeContents();
    run();
});

options.addEventListener("click", function (event) {
    event.preventDefault();

    var element = event.target;
    checkAnswer(quizData, element, nextQuestion);
    nextQuestion++;
});

high_score.addEventListener("click", viewHighScorePage);

function viewHighScorePage() {
    document.getElementById("start-button").style.display = "none";
    document.querySelector(".questions").remove();
    document.querySelector(".quiz-header").remove();
    var highScorePage = document.createElement("div");
    container.appendChild(highScorePage);
    highScorePage.className = "highscore-page";
    document.querySelector(".highscore-page").innerHTML = `
    <form class="highscore-page"><h2>Highscores</h2>
    <br><p class="highscore" id='highscore'>${userInfo
      .map(
        (user) => `
    ${user.player}. ${user.initials} - ${user.highscore}
                `
      )
      .join("<br>")} </p>
    <br>
    <button type="button" class="highscore-btn" id='highscore-btn' value="click" onclick='goBack();'>Go Back</button>
    <button type="button" class="highscore-btn" id='highscore-btn' value="click" onclick='clearHighScores();'>Clear Highscores</button>
    </form>`;
}

function loadData() {

    if (localStorage.getItem('userInfo')) {
        var loadData = localStorage.getItem('userInfo')
        userInfo = JSON.parse(loadData)
    } else {
        return;
    }

}

loadData();
start();
