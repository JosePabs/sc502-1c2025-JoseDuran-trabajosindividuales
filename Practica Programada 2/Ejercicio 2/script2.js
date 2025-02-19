function getGrade(score) {
    if (score === 100) {
      return "A++";
    } else if (score > 89) {
      return "A";
    } else if (score > 79) {
      return "B";
    } else if (score > 69) {
      return "C";
    } else if (score > 59) {
      return "D";
    } else {
      return "F"
    }
  }
  
  console.log(getGrade(96));
  console.log(getGrade(82));
  console.log(getGrade(56));