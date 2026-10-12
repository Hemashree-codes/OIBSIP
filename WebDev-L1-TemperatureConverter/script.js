
const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");
const resetButton = document.getElementById("resetButton");

function convertTemperature(value, from, to) {
    let celsius;

    // First convert the input to Celsius.
    if (from === "C") {
        celsius = value;
    } else if (from === "F") {
        celsius = (value - 32) * 5 / 9;
    } else {
        celsius = value - 273.15;
    }

    // Temperatures below absolute zero are invalid.
    if (celsius < -273.15) {
        return null;
    }

    // Then convert Celsius to the selected unit.
    if (to === "C") {
        return celsius;
    } else if (to === "F") {
        return (celsius * 9 / 5) + 32;
    } else {
        return celsius + 273.15;
    }
}

function unitName(unit) {
    return {
        C: "°C",
        F: "°F",
        K: "K"
    }[unit];
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = Number(temperatureInput.value);

    if (temperatureInput.value.trim() === "" || !Number.isFinite(value)) {
        result.innerHTML = "<p>Please enter a valid temperature.</p>";
        return;
    }

    const converted = convertTemperature(
        value,
        fromUnit.value,
        toUnit.value
    );

    if (converted === null) {
        result.innerHTML =
            "<p>Temperature cannot be below absolute zero (-273.15 °C).</p>";
        return;
    }

    result.innerHTML = `
        <p>Converted temperature</p>
        <h2>${converted.toFixed(2)} ${unitName(toUnit.value)}</h2>
        <p>${value} ${unitName(fromUnit.value)} converted to ${unitName(toUnit.value)}</p>
    `;
});

resetButton.addEventListener("click", function () {
    form.reset();
    result.innerHTML = "<p>Your result will appear here.</p>";
});
