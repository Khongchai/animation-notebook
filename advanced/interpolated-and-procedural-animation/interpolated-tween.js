const tweener = {
    /**
     * @param {{
      beginValue: {},
      endValue: {},
      propertiesToTween: string[],
      duration: number,
      tweenType: string,
      callback: VoidFunction
    }} firstNamedArgument
     */
    tween: function ({
      beginValue,
      endValue,
      propertiesToTween,
      duration,
      tweenType,
      callback,
    }) {
      // A map between the property and the difference corresponding to each of the properties.
      const differenceMap = {};
      propertiesToTween.forEach(
        (property) =>
          (differenceMap[property] =
            endValue[property] - beginValue[property])
      );

      const beginningTime = performance.now();
      const initialValue = Object.seal({ ...beginValue });

      const func = this._tweenTypeResolver(
        tweenType,
        beginningTime,
        differenceMap,
        initialValue,
        duration,
        beginValue,
        callback
      );

      cancelAnimationFrame(func);

      func();
    },

    _tweenTypeResolver: (
      tweenType,
      beginningTime,
      differenceMap,
      /**
       * This is the immutable object used as reference when we interpolate.
       */
      initialValue,
      duration,
      /**
       * This is the object to be interpolated to the next point.
       */
      beginValue,
      callback
    ) => {
      const keys = Object.keys(differenceMap);
      const updateProperties = (x) => {
        keys.forEach((key) => {
          beginValue[key] = initialValue[key] + x * differenceMap[key];
        });
      };

      // https://www.desmos.com/calculator/lskstuoipd
      switch (tweenType) {
        case "linear":
          return function _beginLinearTween() {
            const currentDuration = performance.now() - beginningTime;
            if (currentDuration <= duration) {
              const x = currentDuration / duration;
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginLinearTween);
            }
          };
        // basically 1 to the power of 2
        case "easeInQuad":
          return function _beginEaseInQuadTween() {
            const currentDuration = performance.now() - beginningTime;
            if (currentDuration <= duration) {
              const x = Math.pow(currentDuration / duration, 2);
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginEaseInQuadTween);
            }
          };
        case "easeOutQuad":
          return function _beginEaseOutQuadTween() {
            const currentDuration = performance.now() - beginningTime;
            if (currentDuration <= duration) {
              const x = 1 - Math.pow(1 - currentDuration / duration, 2);
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginEaseOutQuadTween);
            }
          };
        case "easeInOutQuad":
          return function _beginEaseInOutQuadTween() {
            const currentDuration = performance.now() - beginningTime;
            if (currentDuration <= duration) {
              const x =
                (Math.sin(Math.PI * (currentDuration / duration - 0.5)) + 1) /
                2;
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginEaseInOutQuadTween);
            }
          };
        /**
         * animateBounce(beginValue, endValue, duration, angleFrom: someBeginningAngle, to: someEndAngle, onAnimationEnd: someCallback)
         */
        case "spring1":
          //Recommended duration:500
          return function _beginSpring1() {
            const currentDuration = performance.now() - beginningTime;
            const dx = currentDuration / duration;
            // For a sin function, we want to be able to just say,
            // I want the curve from pi to pi2 to be how my function
            // behaves und so was.
            // Example of the desired API
            // animateTween(beginValue, endValue, duration, angleFrom: 0, angleTo: Math.PI)
            // Should also check that the angleFrom is less than the angleTo, or have a strict mode where if true,
            // throws an error, else just convert by adding pi to both angleTo and angleFrom.

            //for now the beginning and the end angles are hard-coded, but eventually,
            // we'd want to be able to pass in the angleFrom and angleTo.

            // https://www.desmos.com/calculator/txhf7v994e

            // This, by the way, applies to all types of functions. You can put
            // any function as the baseFunc and give it the constraint, and our point
            // will always go from 0 to 1 based on the given curve of a function.

            const baseFunc = (x) =>
              Math.pow(Math.E, -1.8 * x) *
              (Math.cos(3.8 * x + -1.8) + Math.sin(3.8 * x + -1.8));

            const begin = 1.3;
            const end = 3.8;

            const x =
              (baseFunc(dx * (end - begin) + begin) - baseFunc(begin)) /
              (baseFunc(end) - baseFunc(begin));
            if (currentDuration <= duration) {
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginSpring1);
            }
          };

        //Recommended duration: 3000
        case "spring2":
          return function _beginSpring2() {
            const currentDuration = performance.now() - beginningTime;
            const dx = currentDuration / duration;
            const baseFunc = (x) =>
              Math.pow(Math.E, -1.8 * x) *
              (Math.cos(3.8 * x + -1.8) + Math.sin(3.8 * x + -1.8));

            const begin = 0;
            const end = 35;
            const x =
              (baseFunc(dx * (end - begin) + begin) - baseFunc(begin)) /
              (baseFunc(end) - baseFunc(begin));
            if (currentDuration <= duration) {
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginSpring2);
            }
          };

        // Bounce with abs(theSpringFunction())
        case "bounce1":
          return function _beginBounce1() {
            const currentDuration = performance.now() - beginningTime;
            const dx = currentDuration / duration;
            const baseFunc = (x) =>
              Math.abs(Math.pow(Math.E, -0.8 * x) * Math.cos(1.9 * x + -6));

            const begin = -5.2;
            const end = 7.8;
            const x =
              (baseFunc(dx * (end - begin) + begin) - baseFunc(begin)) /
              (baseFunc(end) - baseFunc(begin));
            if (currentDuration <= duration) {
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginBounce1);
            }
          };

        // Bounce with abs(theLinearSweepFunction(theSpringEquation()))
        // These default values are not actually that great, actualy need some tweakings.
        case "bounce2":
          return function _beginBounce1() {
            const currentDuration = performance.now() - beginningTime;
            const dx = currentDuration / duration;
            const baseFunc = (x) =>
              Math.abs(
                Math.pow(Math.E, -0.8 * x) *
                  Math.cos(1.74 * x + (3.44 - 1.74) / 1.75) *
                  (x ** 2 / 4)
              );

            const begin = -4;
            const end = 7.8;
            const x =
              (baseFunc(dx * (end - begin) + begin) - baseFunc(begin)) /
              (baseFunc(end) - baseFunc(begin));
            if (currentDuration <= duration) {
              updateProperties(x);

              callback?.();

              requestAnimationFrame(_beginBounce1);
            }
          };

        default:
          throw new Error("Unknown tween type");
      }
    },
  };