import React from "react";

export default function WordList(props) {
  return (
    <li>
      <h4>{props.word.original}</h4>
      <p>Correct answer: {props.word.correct_count}</p>
      <p>Incorrect answer: {props.word.incorrect_count}</p>
    </li>
  );
}
