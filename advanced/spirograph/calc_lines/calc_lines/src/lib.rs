/**
 * TODO list: 1. parse the json in the test file,
 * 2. create test cases (and import compute_epitrochoid).
 * 3. implement the method.
 * 4. return the value as [x, y] to JavaScript.
 */
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn draw_lines() -> Box<[f64]> {
    //  TODO
    return Box::new([]);
}

// TODO write test first
fn compute_epitrochoid(data: &Box<[f64]>, theta: f64, rod_length: f64) -> [f64; 2] {
    println!("{:?}, {}, {}", data, theta, rod_length);

    //TODO return vec2
    return [0.0, 0.0];
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;
    use std::fs;

    #[test]
    fn compute_epitrochoid_test() {
        let data = fs::read_to_string("test_data.json").expect("Unable to read the test json file");
        let values: Value =
            serde_json::from_str(&data).expect("Unable to parse json into rust value");

        for value in values.as_array().unwrap() {
            let args = value["args"].as_object().unwrap();
            let theta = args["theta"].as_f64().unwrap();
            let rod_length = args["rodLength"].as_f64().unwrap();
            println!(
                "{:?}",
                //TODO box::from from this.
                args["data"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .map(|e| e
                        .as_array()
                        .unwrap()
                        .iter()
                        .map(|e| e.as_f64().unwrap())
                        .collect::<Vec<f64>>())
                    .collect::<Vec<Vec<f64>>>()
            );
            // let data: Box<[f64]> = Box::from(
            //     args["data"]
            //         .as_array()
            //         .unwrap()
            //         .into_iter()
            //         .map(|e| e.as_f64().unwrap())
            //         .collect::<Vec<f64>>(),
            // );
            // compute_epitrochoid(&data, theta, rod_length);
        }
    }
}
