import React from "react";

export default function WordList(props) {
  return (
    <li className="word-list">
      <h4 className="word">{props.word.original}</h4>
      <div className="stats">
        <p className="word-info">Correct answer: {props.word.correct_count}</p>
        <p className="word-info">
          Incorrect answer: {props.word.incorrect_count}
        </p>
      </div>
    </li>
  );
}
