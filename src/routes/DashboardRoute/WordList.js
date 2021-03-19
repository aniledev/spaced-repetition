import React from "react";

export default function WordList(props) {
  return (
    <li>
      <h4>{props.word.original}</h4>
      <p className="word-info">Correct answer: {props.word.correct_count}</p>
      <p className="word-info">
        Incorrect answer: {props.word.incorrect_count}
      </p>
    </li>
  );
}
