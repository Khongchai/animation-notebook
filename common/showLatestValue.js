// @ts-check

/**
 * Stringify the value and log it to an element at the bottom right of the
 * screen. The element is a simple fixed square div that always replace
 * the previous value with the current value.
 * @param {any} value
 */
export function showLatestValue(value) {
  let div = document.getElementById("latest-value");
  if (!div) {
    div = document.createElement("div");
    div.id = "latest-value";
    div.style.position = "fixed";
    div.style.bottom = "5vw";
    div.style.right = "5vw";
    div.style.width = "30%";
    div.style.height = "10vw";
    div.style.backgroundColor = "burlywood";
    div.style.borderRadius = "0.25vw";
    div.style.boxShadow = "0 0 1vw 1vw rgba(0, 0, 0, 0.5)";
    div.style.color = "black";
    div.style.fontSize = "2.5vw";
    div.style.padding = "0.5vw";
    div.style.overflow = "auto";
    div.style.display = "grid";
    div.style.zIndex = "1000";
    document.body.appendChild(div);
  }

  div.innerText = JSON.stringify(value);
}

showLatestValue(0);
