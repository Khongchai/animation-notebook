# TODO
# The epitrochoid is based on one rotating base circle alpha and another rotating circle whose rotation beta 
# also depends on the base circle's rotation such that, without sliding, beta is equals to alpha * baseCircleRadius / outerCircleRadius
# However, in our case, we opt out of that physical limitation and allow all rotations to have their own scalar such that 
# the rate of alpha and beta are no longer dependent on each other.
function epitrochoid
    alphaScale = 0.5;
    betaScale = 0.4;

    # With these two values independent, the physical equivalence would be that of sliding cycloids.
    alpha = pi * alphaScale;
    beta = pi * betaScale;
end