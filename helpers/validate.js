const validateId = (answer) => {
  if (answer === '' || isNaN(answer)) {
    return 'Please enter a number';
  } else {
    return true;
  }
};
const validateName = (answer) => {
  if (answer === '' || !isNaN(answer)) {
    return 'Please enter your name';
  } else {
    return true;
  }
};
const validateInput = (answer) => {
  if (answer === '') {
    return 'Please enter an input';
  } else {
    return true;
  }
};

module.exports = { validateId, validateName, validateInput };
