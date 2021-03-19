import React from "react";

export default function WordList(props) {
  return (
    <li>
      <h4>{props.word.original}</h4>
      <p>correct answer: 4</p>
      <p>incorrect answer 3</p>
    </li>
  );
}
