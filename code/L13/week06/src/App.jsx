import 'bootstrap/dist/css/bootstrap.min.css';
import {Question} from './models/QAModels.mjs';
import NavHeader from './NavHeader';
import QuestionDescription from './QuestionDescription';
import Answers from './Answers';
import { useState } from 'react';

const fakeQuestion = new Question(1, "Is JavaScript better than Python?", "luigi.derussis@polito.it", 1, "2025-02-28");
fakeQuestion.init();
const fakeAnswers = fakeQuestion.getAnswers();

function App() {
  const [question, setQuestion] = useState(fakeQuestion);
  const [answers, setAnswers] = useState(fakeAnswers);

  return (
    <>
      <NavHeader numQuestion={question.id}/>
      <QuestionDescription question={question}/>
      <Answers answers={answers} setAnswers={setAnswers}/>
    </>
  )
}

export default App
