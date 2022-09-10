// !Warning. Really fun stuff below.

/**
 *
 * @param {number} baseSteps
 * @param {number[]} cycloidScalars
 * @param {number} maxPoints
 * @returns
 *
 * More readable version: TODO(mathmatical notation)
 */
function calcPoints(baseSteps, cycloidScalars, maxPoints = 30000) {
  return Math.floor(
    Math.min(
      baseSteps *
        cycloidScalars.reduceWithResult(
          (calcResult, a, b) => (lcm(a, b) / b) * (calcResult ?? 1),
          1
        ),
      maxPoints
    ) + 1 // If you remove the +1 and see a tiny space, then the algorithm works.
  );
}

/**
 * @template T
 * @param {(calcResult: T, ithElement: T, ithPlusOneElement: T) => T} callback
 * @param {T} defaultValue
 *
 * Like reduce, but with an additional result property.
 *
 * With the normal reduce, you get the previous value, but lose a reference to the previous element.
 *
 * Let's say for the array [a, b, c],
 * using a reduce on this array, the first iteration would be:
 *
 * (a, b) => a + b
 *
 * and the second iteration
 *
 * (k, c) => k + b
 *
 * where k is the sum of a and b (ith and i-1th elements).
 *
 * What we are trying to do here is to retain the reference to b(the i-1 element) so that we can do something like:
 *
 * (k, b, c) => whatever(k, b, c)
 *
 * If it's the first iteration, k will be null.
 *
 * TODO this is wrong. Normal reduce already give you a result, just not the previous number as well.
 */
Array.prototype.reduceWithResult = function (callback, defaultValue) {
  let result = null;
  for (let i = 0; i < this.length; i++) {
    result = callback(result, i === 0 ? defaultValue : this[i - 1], this[i]);
  }
  return result;
};

//TODO use webassembly for this migh be less painful...
function multiLcm(...numbers) {
  const maxDecimalCount = numbers.reduce((a, b) =>
    Math.max(countDecimals(a), countDecimals(b))
  );

  let n = 1;
  for (let i = 0; i < numbers.length; i++) {
    const thisNumAsInt = Math.ceil(numbers[i] * Math.pow(10, maxDecimalCount));
    n = lcm(thisNumAsInt, n);
  }

  let adjacentMaxDecimal = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    const product = multiplyAsInt(numbers[i], numbers[i + 1]);
    const curDecimals = countDecimals(product);
    adjacentMaxDecimal = Math.max(curDecimals, adjacentMaxDecimal);
  }

  return n / Math.pow(10, 3);
}

const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};

function gcd(a, b) {
  while (b) {
    const tmp = b;
    b = a % b;
    a = tmp;
  }

  return a;
}

function multiplyAsInt(num1, num2) {
  const maxDecimalPlaces = Math.pow(
    10,
    Math.max(countDecimals(num1), countDecimals(num2))
  );
  const sumDecimalPlaces = maxDecimalPlaces * 2;
  const int1 = Math.ceil(num1 * maxDecimalPlaces);
  const int2 = Math.ceil(num2 * maxDecimalPlaces);
  console.log(int1 * int2);

  const result = (int1 * int2) / sumDecimalPlaces;
  return result;
}

function countDecimals(value) {
  if (value % 1 != 0) {
    return value.toString().split(".")[1].length;
  }
  return 0;
}
