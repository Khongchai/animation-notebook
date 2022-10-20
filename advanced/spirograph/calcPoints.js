function fractionalLcm(numbers) {
  let longestFractionalPart = 0;
  let max = Math.max;

  for (let i = 0; i < numbers.length; i++) {
    // Number not a fraction
    if (numbers % 1 == 0) continue;

    max(longestFractionalPart, numbers[i].split(".")[1].length);
  }

  return (
    (1 * longestFractionalPart) /
    gcd(numbers.map((n) => n * longestFractionalPart))
  );
}

function gcd(numbers) {
  let result = 1;

  function _gcd(a, b) {
    while (b) {
      const tmp = b;
      b = a % b;
      a = tmp;
    }

    return a;
  }

  for (let i = 0; i < numbers.length; i++) {
    result = _gcd(result, numbers[i]);
  }

  return result;
}
