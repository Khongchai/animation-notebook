const max = Math.max;
const pow = Math.pow;
const round = Math.round;

function fractionalLcm(numbers) {
  let longestFractions = 0;

  for (let i = 0; i < numbers.length; i++) {
    // Number not a fraction
    if (numbers[i] % 1 == 0) continue;

    longestFractions = max(
      longestFractions,
      numbers[i].toString().split(".")[1].length
    );
  }

  const powerOfTen = pow(10, longestFractions);
  const result = powerOfTen / gcd(numbers.map((n) => round(n * powerOfTen)));

  return result;
}

function gcd(numbers) {
  let result = numbers[0] ?? 1;

  function _gcd(a, b) {
    while (b) {
      const tmp = b;
      b = a % b;
      a = tmp;
    }

    return a;
  }

  for (let i = 1; i < numbers.length; i++) {
    result = _gcd(result, numbers[i]);
  }

  return result;
}
