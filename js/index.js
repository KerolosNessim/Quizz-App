let categoryMenu = document.getElementById("categoryMenu");
let difficultyOptions = document.getElementById("difficultyOptions");
let questionsNumber = document.getElementById("questionsNumber");
let startQuiz = document.getElementById("startQuiz");
let formSelectors = document.getElementById("formSelectors");
let QuestionSection = document.getElementById("QuestionSection");
let messageSection = document.getElementById("messageSection");
let allQuestions;
let quiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let questions = questionsNumber.value;
  quiz = new Quiz(category, difficulty, questions);
  allQuestions = await quiz.getAllQuestions();
  let myQuestion = new Question(0);
  formSelectors.classList.replace("d-block", "d-none");
  myQuestion.displayQuestion();
});
class Quiz {
  constructor(category, difficulty, questions) {
    this.category = category;
    this.difficulty = difficulty;
    this.questions = questions;
    this.score = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.questions}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async getAllQuestions() {
    let response = await fetch(this.getApi());
    let result = await response.json();
    let final = result.results;
    return final;
  }
  displayScore() {
    let cartona = `
        <h3 class="h1 text-center my-4">${this.score==allQuestions.length?"Congratulation 🥳 ":"opps 😒 "}your score is ${this.score} of ${allQuestions.length}</h3>
        <button
          type="button"
          id="tryAgain"
          class="btn btn-primary d-block mx-auto px-5 fs-5 my-0 shadow-sm rounded-pill"
        >
          Try Again
        </button>
    `;
    messageSection.innerHTML = cartona;
    messageSection.classList.replace("d-none", "d-block");
    QuestionSection.classList.replace("d-block", "d-none");
  }
}
class Question {
  constructor(index) {
    this.index = index;
    this.correct_answer = allQuestions[index].correct_answer;
    this.incorrect_answers = allQuestions[index].incorrect_answers;
    this.category = allQuestions[index].category;
    this.question = allQuestions[index].question;
    this.allAnswers = this.getAllAnswers();
    this.cheked = false;
  }
  getAllAnswers() {
    let answers = [...this.incorrect_answers, this.correct_answer];
    answers.sort();
    return answers;
  }
  displayQuestion() {
    let cartona = `
    <span class="text-capitalize text-secondary fw-bold">
          ${this.category}
        </span>
        <h4 class="text-capitalize">
          ${this.question}
        </h4>
        <ul class="choises list-unstyled my-4">
          
          ${this.allAnswers
            .map(function (element) {
              return `<li class="py-3 px-3 fs-5 mb-4">${element}</li>`;
            })
            .join(" ")}
        </ul>
        <div class="d-flex justify-content-between align-items-center px-2">
          <p class="fs-4 fw-bold">
            <span class="text-primary">Score : </span>${quiz.score}
          </p>
          <p class="text-secondary fs-5">${this.index + 1} of ${
      allQuestions.length
    }</p>
        </div>
    `;
    QuestionSection.innerHTML = cartona;
    QuestionSection.classList.replace("d-none", "d-block");
    document.querySelectorAll(".choises li").forEach((ele) => {
      ele.addEventListener("click", () => {
        this.checkAnswer(ele);
      });
    });
  }
  checkAnswer(li) {
    if (!this.cheked) {
      this.cheked = true;
      if (li.innerHTML === this.correct_answer) {
        li.classList.add("bg-success");
        li.classList.add("text-white");
        quiz.score++;
      } else {
        li.classList.add("bg-danger");
        li.classList.add("text-white");
      }
      this.nextQuestion();
    }
  }
  nextQuestion() {
    this.index++;
    if (this.index < allQuestions.length) {
      setTimeout(() => {
        let nextQuestion = new Question(this.index);
        nextQuestion.displayQuestion();
      }, 2000);
    } else {
      quiz.displayScore();
      document.getElementById("tryAgain").addEventListener("click", function () {
        window.location.reload();
      })
    }
  }
}
