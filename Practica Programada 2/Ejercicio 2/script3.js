function hasPassingGrade(score) {
    return getGrade(score) !== "F";
  }
  
  
  console.log(hasPassingGrade(100));
  console.log(hasPassingGrade(53));
  console.log(hasPassingGrade(87));