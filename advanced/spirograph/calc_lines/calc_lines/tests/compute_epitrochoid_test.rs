// Use the json from the generate_test_cases folder.
// TODO move test into another folder.
mod tests {
    use serde_json::{Result, Value};
    use std::fs;

    #[test]
    fn compute_epitrochoid_test() {
        let data = fs::read_to_string("test_data.json").expect("Unable to read the test json file");
        let value: Value =
            serde_json::from_str(&data).expect("Unable to parse json into rust value");
        println!("Test data: {}", value);

        assert_eq!(true, true);
    }
}
