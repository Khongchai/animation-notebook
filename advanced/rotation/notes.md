# On angular momentum being conserved and how it is related to skaters rotating faster:

Angular momentum is `L = I * omega` where omega denotes angular velocity. L being conserved means unless there is an external torque, L is fixed. Changing I should result in omega increasing to compensate and keep L the same.

I, the moment of inertia, is `I = body.segments.reduce((acc, s) => acc + s.m * s.r ** 2, 0)`. Or in english: "I is the sum of m[i] · r[i]² over every mass segment i of the body, where r[i] is that segment’s distance from the rotation axis."

r[i] is squared in the equation because of how L is derived. The full equation is

```
L = radius * mass * speed
L = radius * mass * (omega * radius)
L = mass * (radius ** 2) * omega
L = (I = mass * (radius ** 2)) * omega
```

A skater pulling her arm in reduces `r` significantly, therefore the `I` part is reduced and therefore omega(velocity) must increase.