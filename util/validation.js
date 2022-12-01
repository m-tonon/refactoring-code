function postIsValid (title, content) {
  return (
    enteredTitle &&
    enteredContent &&
    enteredTitle.trim() === '' &&
    enteredContent.trim() === ''
  );
}

module.exports = {
  postIsValid: postIsValid
}