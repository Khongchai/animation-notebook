fn main() {
    fractional_lcm(&[20.2, 20.3]);
}

fn fractional_lcm(numbers: &[f64]) -> f64 {
    let _longest_fractions: f64 = 0.0;

    for i in 0..numbers.len() {
        if numbers[i] % 1.0 == 0.0 {
            continue;
        };

        println!("{}", i);
    }

    // Mock return value.
    return 0.0;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fractional_lcm_test() {
        let value1: f64 = fractional_lcm(&[1.0, 5.1, 5.11, 2]);
        let value2: f64 = fraction_lcm(&[1.1, 20.5, 2.3, 6.0]);
        let value3: f64 = fraction_lcm(&[1.1, 1.12, 2.23, 1.0]);
        let value4: f64 = fraction_lcm(&[2.56, 3.41, 5.11]);

        assert_eq!(value1, 50);
        assert_eq!(value2, 10);
        assert_eq!(value3, 100);
        assert_eq!(value4, 100);
    }
}
