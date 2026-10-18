# Angular momentum learning log

Starting goal: understand angular momentum using a spinning wheel with spokes in `simple-2d-simulation.html`, and make the wheel come to a stop on its own.

First correction: angular momentum and stopping are two separate ideas. Angular momentum is the amount of rotation an object has, and it stays the same unless a torque acts on the object. The wheel stops because friction is a torque. A wheel with angular momentum and no friction spins forever.

## Summary

| Concept | What it is | Where it is in the code |
|---|---|---|
| Angle as state | The simulation stores values and updates them each frame instead of computing them from time | `angle += omega * dt` |
| dt | Real seconds since the last frame, so the result does not depend on frame rate | `draw((dt) => …)` |
| Angular velocity ω | How fast the angle changes, in rad/s | `omega` |
| Two kinds of friction | Constant (brake) and speed-dependent (drag). Together with a drive they produce a balance speed | `brakeTorque`, `dragTorque` |
| Net torque | Add every push together, then apply the sum once | `netTorque` |
| Moment of inertia | `I = Σ mass × R²`. Distance from the center counts more than mass | `ballsMomentOfInertia()` |
| Angular momentum | `L = I × ω` | `L` |
| Torque changes L | `L += netTorque × dt`, written `τ = dL/dt` in physics books | the update line |
| Conservation | With no torque, `L` stays the same, so a smaller `I` gives a larger ω (16× when every ball moves to a quarter of its distance) | `omega = L / I` |

---

## Task 1: Angle as state

### Starting code

```js
const theta = t * 0.01;
const rotation = { x: theta, y: theta };
```

### What I tried and what was wrong

1. **Two numbers for one rotation.** I stored the rotation as `x` and `y`. In 2D a rotation is one number, the angle. `cos` and `sin` turn that one angle into an x and y position on the circle. I collapsed it to a single `angle`, which was correct.
2. **Moved the angle into state.** I created an object with `angle` and `omega` and updated `angle += omega` each frame. This was the main goal of the task and it was correct.
3. **Named the object `angularMomentum`.** It only held an angle and an angular velocity. Momentum needs mass (linear momentum is `mass × velocity`), and the wheel had no mass yet. The name was premature.
4. **Added a hidden second velocity.** I wrote:
   ```js
   change += t * 0.000005;
   angularMomentum.angle += angularMomentum.omega + change;
   ```
   `change` grew by a growing amount each frame, so the speed increased faster and faster instead of at a steady rate. It also meant `omega` no longer described how fast the wheel was turning, because `change` was a second velocity added next to it.

### Answers I gave

- **"In the old version, changing 0.01 does nothing."** Wrong. In the old version `angle = t × rate`, so changing the rate from `0.01` to `0.02` at `t = 500` makes the angle jump from 5 to 10 radians in one frame. The wheel teleports. Storing velocity as state avoids this.
- **"The unit is fps."** Wrong unit. fps is frames per second. `omega` was in radians per frame. I was right that a 144Hz screen spins it faster, because more frames run each second and each one adds the same amount.

---

## Task 2: dt and friction

### 2a. Real units with dt

**First attempt at the helper:** `let last = 0`, then `dt = next - last`. On the first frame, `last` is 0, so `dt` equals the whole time since the page loaded. I fixed it by starting `last` as `null` and setting it on the first frame. Later I also capped `dt` at `0.1` so switching tabs and coming back does not produce one huge step.

**First attempt at the update:**
```js
ω = dt;
angle += ω;
```
This set the angular velocity equal to the frame time. Read out loud, it says "the wheel's speed equals how long the last frame took". It also overwrote `ω` every frame, so `ω` was no longer state and nothing could slow it down later. My comment also still counted in frames.

**How I got to the answer:** `dt` is not a velocity. It is what a velocity is multiplied by to get the change for one frame. Units check: rad/s × s = rad. The fix was to set `ω = 2π` once outside the loop and use `angle += ω * dt`, so one turn takes one second on any screen.

### Side question: the wheel looked like it slowed down and went backward

While α was speeding the wheel up, it looked like it slowed down and then reversed. I asked if this was the Nyquist frequency. It was: temporal aliasing, also called the wagon-wheel effect. The frame rate is the sampling rate. With 4 identical spokes, the picture repeats every quarter turn (π/2), so the eye matches each spoke to the nearest spoke in the next frame. The green spoke repeats only every full turn, so it starts aliasing at a higher speed. This is a display effect. `angle` and `ω` were still increasing, and the graph shows the real values.

### 2b and 2c. Two friction variants

```js
ω = Math.max(0, ω - α * dt);
```
```js
ω *= 0.99;
```

The `Math.max` was needed because without it the constant friction kept subtracting after the wheel stopped and made it spin backward.

**Answers I gave and corrections:**

- **Which reaches zero?** I said both, because of float64. Variant 1 reaches exactly zero in finite time. Variant 2 only gets closer each frame and reaches zero only when float64 underflows, which takes a very long time.
- **"The variant that acts on acceleration is correct since forces change acceleration, not velocity."** Two errors. A force does not change acceleration, it causes it (`F = m·a`), and acceleration changes velocity. Also, both variants are accelerations. The second one is an acceleration that depends on ω. The real difference between them is constant friction (a brake pad or a bearing) versus friction that grows with speed (air drag).
- **Does the slowing get stronger or weaker?** Weaker, because 1% of a small number is smaller than 1% of a large number. Correct.
- **Which feels like a bicycle wheel?** I picked the constant one. A real wheel has both: drag matters most at high speed, and bearing friction is what makes it actually stop.
- **Is `*= 0.99` frame-rate independent?** I said no and that it needs `dt`. Correct. At 144Hz the 0.99 is applied more times per second than at 60Hz, so the wheel slows down faster.

**Q1 follow-up:** I worked out that variant 1 stops after 10 seconds from `ω₀ / α = 2π / (2π/10) = 10`, without running anything.

### 2d. Rewriting the second variant as an acceleration

I wrote `α = -(ω * 0.1)` and `ω += α * dt`. Correct. α is proportional to ω and points the opposite way.

**Which value matches `ω *= 0.99` at 60fps?** I could not work it out and asked for the answer. It is about `0.6`, measured in 1/s. Derivation:

```
ω_new = ω + (-k·ω)·dt = ω · (1 - k·dt)
1 - k·dt = 0.99
k·dt = 0.01
k = 0.01 / dt = 0.01 × 60 = 0.6
```

The exact value is `-ln(0.99) × 60 ≈ 0.603`. The difference comes from Euler integration (`ω += α·dt`), which assumes α stays the same for the whole frame.

**Two algebra steps I did not follow at first:**

1. *Factoring.* `ω + (-k·ω)·dt` becomes `ω·(1 - k·dt)` because both terms contain ω, so ω can be written once outside the parentheses. Check with numbers: `ω = 10, k = 0.6, dt = 1/60` gives 9.9 both ways.
2. *Solving.* `1 - k·dt = 0.99` becomes `k·dt = 0.01` by subtracting 1 from both sides (`-k·dt = -0.01`) and then multiplying both sides by -1. Rule: whatever is done to one side is done to the other.

**Bonus:** after one second at 60fps, `0.99⁶⁰ ≈ 0.547`, so about 45% of the speed is lost each second.

**Large dt:** with drag, each step multiplies ω by `(1 - k·dt)`. If `dt` is large enough, that factor goes negative and ω flips sign, which real friction cannot do. Capping `dt` at `0.1` prevents it.

### Combining drive, brake and drag

**Attempt 1.** I renamed `ω` and `α` to `v` and `a`, added a constant brake `d` (and called it "drag"), and updated `v` three times in a row:
```js
v += -d * dt;
v = v + -(v * 0.6) * dt;
v += a * dt;
v = Math.max(0, v);
```
Problems:
- Each line used a `v` the previous line had already changed. The pushes should all be computed from the same speed, added together, and applied once.
- `Math.max(0, v)` assumes the wheel only spins forward.
- `v` and `a` usually mean straight-line velocity and acceleration, and Task 3 needed `v` for the speed of a ball. I renamed back to `omega` and `alpha`.
- "Drag" usually means the speed-dependent kind, so I renamed the constant one `friction`.

**Attempt 2.** One line:
```js
omega = (omega - friction * dt) * (1 - drag * dt) + alpha * dt;
```
Still applied in order: brake first, then drag on the already-braked speed. I did not understand "multiply it out". With numbers (`omega = 10, friction = 3, drag = 0.6, dt = 0.1`): in order gives `9.7 → 9.118`. All at once gives `10 - 0.3 - 0.6 = 9.1`. The difference (0.018) comes from drag taking 6% of 9.7 instead of 6% of 10. At 60fps it is about 0.0005 and not visible. The reason to change it was structure: in Task 3 the pushes become torques that are added and divided by `I`.

**Attempt 3.**
```js
const _drag = 1 - drag;
const netAlpha = drive - (brake + _drag);
```
`_drag` was always 0.4, whatever the speed, so it was a second constant brake. The `1 -` was left over from the factored form `omega · (1 - drag·dt)`, where the `1` meant "keep the current omega". In the `omega += …` form, `+=` already keeps the current omega.

**Attempt 4 (correct).**
```js
const _drag = drag * omega;
const netAlpha = drive - (brake + _drag);
omega += netAlpha * dt;
```

### Balance speed

When the drive is stronger than the brake, the wheel speeds up, drag grows, and at some speed brake + drag equals drive. `netAlpha` is then 0 and ω stays constant. Solve `drive - (brake + drag × omega) = 0` for `omega`.

I tested `alpha = 2π, friction = π` with a starting ω of `2π`, and the wheel slowed down instead of speeding up. I was confused because I had called it "top speed". The starting speed was above the balance speed, so drag was larger than needed and net α was negative. The wheel approaches the balance speed from either side, so "balance speed" is a better name. I skipped solving the equation.

---

## Task 3: Moment of inertia

### 3a. Balls

I added an array of balls, each with `mass` and `r`, where `r` is a fraction of the wheel's `radius`. Real distance in pixels: `R = r × radius`.

### 3b. Speed of a ball

1. Distance in one turn: `2π × R`. Correct.
2. Time for one turn: I wrote `ω / 2π`. Wrong, it is inverted. Test with `ω = 4π`: the wheel makes 2 turns per second, so one turn takes 0.5 s, but `4π / 2π = 2`. `ω / 2π` is turns per second. Seconds per turn is `2π / ω`.
3. Speed = distance ÷ time = `2π·R / (2π / ω)` = **`R × ω`**. The `2π` cancels.

### 3c. Moment of inertia

I asked what `R` means in `L = R × mass × speed`. It is the same `R` as in 3b, the ball's distance from the center in pixels.

```
L = R × mass × (R × ω)
L = (mass × R²) × ω
I = mass × R²
```

- Double the mass: `I` doubles.
- Double `R`: `I` becomes 4×, because `R` is squared. Distance counts more than mass.

**Code attempt 1:**
```js
balls.reduce((prev, cur) => {
  return cur.r ** 2 * cur.mass * omega
}, 0);
```
Result `94.247…`, which is `15 × 2π`, the last ball only. Three bugs:
- `prev` was never added, so only the last ball counted.
- Multiplying by `omega` computes `L`, not `I`.
- `cur.r` is a fraction, not the distance in pixels.

**Code attempt 2:** fixed `omega` and pixels, but still did not add `prev`. Result `600000` (`200² × 15`, the last ball). I also named the local variable `radius`, which hid the outer `radius` constant, and wrote `200` by hand.

**Code attempt 3:** `1,037,500`. Correct. The rim ball (mass 15) contributes 600,000, more than the heavier middle ball (mass 20, 200,000), because of `R²`.

### 3d. Torques

Drive, brake and drag became torques, and `netAlpha = netTorque / I`, following `a = F / m`. Notes:
- My comment said `a = m/F`. The code was correct; the comment was not.
- `I` is about a million, so I scaled the drive and brake by 100,000. I did not scale `drag`, so drag became too small to matter.

### Calculating the speed-up when balls move in

**Attempt 1.** I wrote `0.75L = (m · 0.75r²) · ω`. The reasoning (if `I` shrinks, ω must grow by the same factor for `L` to stay the same) was correct. Errors:
- The new distance is `0.75r`, and the whole distance is squared: `(0.75r)² = 0.75² × r²`. I squared only `r`. Check with `r = 2`: `(1.5)² = 2.25`, but `0.75 × 4 = 3`.
- "Reducing r by 75%" means keeping 25% (`0.25r`). `0.75r` is a 25% reduction.
- I used `N` and `μ` for ω in different lines.

**Attempt 2 (correct).**
```
(0.75²) × L = m × (0.75r)² × ω
L = m × (0.75r)² × ω / 0.75²
```
- 75% of the distance: `1 / 0.5625 ≈ 1.78×` faster, more than 1.75× because of the square.
- 25% of the distance: `1 / 0.0625 = 16×` faster. This is why a figure skater spins faster after pulling their arms in.

### Side question: all `r = 0` broke the simulation

With every `R = 0`, `I = 0`, and `netTorque / I` divides by zero. In JS `5 / 0` is `Infinity` and `0 / 0` is `NaN`. Once `angle` is `NaN`, `cos` and `sin` return `NaN` and nothing draws. The physics reason: the balls are point masses, and a point at the axis does not move when the wheel turns, so a wheel with only those has no resistance to turning. Real wheels have a hub and spokes with mass, and real balls have size. Fixes: add a hub `I` that is always included, or keep `r` above a minimum. I chose a minimum `r`.

---

## Task 4: Conservation of angular momentum

**Attempt 1.**
```js
angle = angle + omega * dt * (1 / perpDist ** 2);
```
It looked correct when every ball had the same `r` and there were no torques, because then `I` is proportional to `perpDist²`. Problems:
- `omega` no longer held the real speed. The graph stayed flat while the wheel visibly sped up. This was the same hidden-velocity problem as `change` in Task 1.
- With balls at different distances, there is no single `perpDist` to use.
- With torques on, `dragTorque = drag * omega` used the wrong speed.

**Attempt 2.**
```js
const remaining = I / IMax;
omega = originalOmega / remaining ** 2;
```
Something felt wrong. Three problems:
- `I` already contains `R²`, so squaring `remaining` counted it twice. With every ball at `0.5`, the code gave 16× instead of 4×.
- `IMax` meant every ball at the rim, but the balls did not start there, so `omega` jumped on the first frame.
- `omega` was overwritten every frame, which threw away the result of `omega += netAlpha * dt`. This was the same overwrite as `ω = dt` in Task 2.

All three came from computing ω relative to a fixed reference instead of storing the value that stays the same.

**Attempt 3.** I realized the missing piece was `L` itself.
```js
const L = omega * ballsMomentOfInertia();
const updatedL = omega * I;
const remaining = updatedL / L;
omega = omega / remaining ** 2;
```
Problems:
- `remaining` is a ratio of two `L` values, both containing `R²`, so squaring it counted `R²` twice again. Worked on paper, this makes `omega` switch between two values on alternate frames after the balls move.
- With `L` and `I` known, `omega = L / I` is one line. `updatedL` and `remaining` were not needed.
- `L` was `const`, so no torque could change it.

**Attempt 4.**
```js
omega = L / I;
omega += netAlpha * dt;
```
Conservation worked with torques off. With torques on, the speed-up was added to `omega` and discarded on the next frame, because `L` never changed.

**How I got to the torque rule.** I did not understand "multiply both sides by I", because `omega += …` has no sides. Restated:
```
change in L = I × (change in omega)
change in L = I × (netTorque / I) × dt
change in L = netTorque × dt
```
Number check for step 1: with `I = 4`, ω going from 10 to 13 moves `L` from 40 to 52, a change of 12 = 4 × 3. `I` cancels in step 3, so a torque changes `L` by the same amount whether the wheel is heavy or light. Weight only matters when converting `L` back into ω.

**Attempt 5 (correct).**
```js
L = Math.max(0, L + netTorque * dt);
omega = L / I;
angle += omega * dt;
```
The clamp first sat on `omega`. That let the brake push `L` below zero forever after the drive stopped while `omega` showed 0. Moving the clamp to `L` keeps the two in agreement. The graph now has an `L` panel, which should stay flat while the balls move and all torques are 0.

---

## Task 5: Pushing the wheel (skipped)

The task was to drag with the mouse to apply a force at a point on the wheel. I skipped it because it is mostly input handling. The physics in it:

- Torque = (distance from the center) × (the part of the force at a right angle to the spoke). Pushing a door near the handle opens it more easily than pushing near the hinge.
- The part of the force pointing along the spoke, toward or away from the center, does not turn the wheel. It pushes on the axle.
- In code, this is the 2D cross product of the push point (relative to the center) and the force: `x × Fy - y × Fx`.

---

## Other questions I asked

- **What level of physics is this?** The rotation part (ω, α, torque, moment of inertia, conservation) is the rotational mechanics unit of AP Physics 1, A-level, or first-year university physics. The simulation part (Euler integration, `dt`, frame-rate independence) comes from numerical methods and game physics. The drag time constant (`e`, 37%) comes from first-year calculus.

## Possible next topics

- Rotational kinetic energy, `½ I ω²`. When the balls move in, `L` stays the same. Does the energy, and if it changes, where does the difference come from?
- Rolling: connecting ω to straight-line motion along the ground.
- 3D rotation, where angular momentum is a vector. This explains gyroscopes and spinning tops.
