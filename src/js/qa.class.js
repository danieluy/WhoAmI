"use strict";

const Qa = function (values) {
  this.question = values.q; // :string
  this.answer = values.a; // :boolean
}

Qa.prototype.view = function () {
  let div = document.createElement('div');

  let question = document.createElement('div');
  question.innerHTML = this.question;
  div.appendChild(question);

  let answer = document.createElement('div');
  if (this.answer)
    answer.innerHTML =
      '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
        '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>' +
      '</svg>';
  else
    answer.innerHTML =
      '<svg fill="#888" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
      '</svg>';

  div.appendChild(answer);

  return div;
}

module.exports = Qa;


