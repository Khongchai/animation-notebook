// !Warning. Really fun stuff below.

/**
 *
 * @param {number} baseSteps
 * @param {number[]} cycloidScalars
 * @param {number} maxPoints
 * @returns
 *
 * More readable version:
 */
function calcPoints(baseSteps, cycloidScalars, maxPoints = 30000) {
  return Math.floor(
    Math.min(
      baseSteps *
        cycloidScalars.reduceWithResult((calcResult, a, b) => {
          return (lcm(a, b) / b) * calcResult ?? 1;
        }, 1),
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
 * where k is the sum of a and b.
 *
 * What we are solving here is retain the reference to b(the i-1 element) so that we can do something like:
 *
 * (k, b, c) => whatever(k, b, c)
 */
Array.prototype.reduceWithResult = function (callback, defaultValue) {
  let result = defaultValue;
  for (let i = 0; i < this.length - 1; i++) {
    result = callback(result, i === 0 ? defaultValue : this[i - 1], this[i]);
  }
  return result;
};

function lcm(a, b) {
  const decimalPlacesFromA = countDecimals(a);
  const decimalPlacesFromB = countDecimals(b);
  const maxDecimalPlaces = Math.max(decimalPlacesFromA, decimalPlacesFromB);
  const targetDecimal = Math.pow(10, maxDecimalPlaces);

  const calculate = (a, b) => {
    return (a * b) / gcd(a, b);
  };

  if (targetDecimal) {
    a *= targetDecimal;
    b *= targetDecimal;

    const res = calculate(a, b);

    return res / targetDecimal;
  }
  return calculate(a, b);
}

function gcd(a, b) {
  while (b) {
    const tmp = b;
    b = a % b;
    a = tmp;
  }

  return a;
}

function countDecimals(value) {
  if (value % 1 != 0) {
    return value.toString().split(".")[1].length;
  }
  return 0;
}
