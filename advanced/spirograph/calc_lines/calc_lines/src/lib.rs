/**
 * TODO list: 1. parse the json in the test file,
 * 2. create test cases (and import compute_epitrochoid).
 * 3. implement the method.
 * 4. return the value as [x, y] to JavaScript.
 */
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn draw_lines(data: JsValue, theta: f64, rod_length: f64) -> Box<[f64]> {
    //  TODO
    return Box::new([]);
}

// TODO write test first
pub fn compute_epitrochoid(data: &Vec<Vec<f64>>, theta: f64, rod_length: f64) -> [f64; 2] {
    println!("{:?}, {}, {}", data, theta, rod_length);

    //TODO return vec2
    return [0.0, 0.0];
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::{Map, Value};
    use std::fs;

    #[test]
    fn compute_epitrochoid_test() {
        let data: String =
            fs::read_to_string("test_data.json").expect("Unable to read the test json file");
        let values: Value =
            serde_json::from_str(&data).expect("Unable to parse json into rust value");

        for value in values.as_array().unwrap() {
            let args: &Map<String, Value> = value["args"].as_object().unwrap();
            let theta: f64 = args["theta"].as_f64().unwrap();
            let rod_length: f64 = args["rodLength"].as_f64().unwrap();

            let data: Vec<Vec<f64>> = args["data"]
                .as_array()
                .unwrap()
                .iter()
                .map(|e| {
                    e.as_array()
                        .unwrap()
                        .iter()
                        .map(|e| e.as_f64().unwrap())
                        .collect::<Vec<f64>>()
                })
                .collect::<Vec<Vec<f64>>>();

            let computation_result = compute_epitrochoid(&data, theta, rod_length);
            let result = value["result"].as_object().unwrap();

            assert!(
                computation_result[0] == result["x"].as_f64().unwrap()
                    && computation_result[1] == result["y"].as_f64().unwrap()
            );
        }
    }
}
