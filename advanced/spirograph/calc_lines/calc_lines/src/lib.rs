use core::panic;

use std::f64::consts::PI;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn draw_lines(
    points: i64,
    mut theta: f64,
    step: f64,
    data: JsValue,
    rod_length: f64,
) -> Box<[f64]> {
    let mut arr: Vec<f64> = Vec::new();
    let mut first_time = true;
    let mut prev_point: [f64; 2] = [0.0, 0.0];
    let mut current_point: [f64; 2] = [0.0, 0.0];
    let parsed_data: Vec<Vec<f64>> = serde_wasm_bindgen::from_value(data).unwrap();
    for _ in 0..points {
        let new_point = compute_epitrochoid(&parsed_data, theta, rod_length);

        if first_time {
            first_time = false;
            prev_point = new_point;
        } else {
            current_point = new_point;
            arr.push(prev_point[0]);
            arr.push(prev_point[1]);
            arr.push(current_point[0]);
            arr.push(current_point[1]);
        }

        theta += step;
    }

    return Box::from(arr);
}

pub fn compute_epitrochoid(data: &Vec<Vec<f64>>, theta: f64, rod_length: f64) -> [f64; 2] {
    if data.len() < 2 {
        panic!("Provide at least 2 cycloids");
    }

    let mut final_point = [0.0, 0.0];

    for i in 0..data.len() {
        let current_data = &data[i];
        final_point[0] += (current_data[0] + current_data[1])
            * (theta * current_data[3] - PI * 0.5 * current_data[2]).cos();
        final_point[1] += (current_data[0] + current_data[1])
            * (theta * current_data[3] + PI * 0.5 * current_data[2]).sin();
    }

    return [
        final_point[0] + rod_length * theta.cos(),
        final_point[1] + rod_length * theta.sin(),
    ];
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
