class QuestionModel
{
    constructor(id, post, askedBy, question, answer, answeredBy, questionsCount){
        this.id = id;
        this.post = post;
        this.askedBy = askedBy;
        this.question = question;
        this.answer = answer;
        this.answeredBy = answeredBy;
        this.questionsCount = questionsCount;
    }
}

export default QuestionModel;