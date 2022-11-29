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
fn compute_epitrochoid(data: Box<[f64]>, theta: f64, rod_length: f64) -> [f64; 2] {
    println!("{:?}, {}, {}", data, theta, rod_length);

    //TODO return vec2
    return [0.0, 0.0];
}
