// Only check that users respected the minimum, value.
function check_min() {
    if (timer_input.value === "") return;
    if (timer_input.value < 1) {
        save_button.disabled = true;
        set_status ("Timer can't be less than minimum of 1 minutes.", 1000);
    } else if (save_button.disabled === true) {
        save_button.disabled = false;
    }
}

function set_status(data, timer){
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = data;
    setTimeout(function() {
        status.innerHTML = "";
    }, timer);
}

// Saves options to localStorage.
function save_options() {
    localStorage["timer"] = timer_input.value;
    set_status("Options Saved", 750);
}

// Restores timer_input value from localStorage
function restore_options() {
    var timer = localStorage["timer"];
    if (!timer) return;
    timer_input.value = timer;
}

var timer_input = document.getElementById("timer");
var save_button = document.getElementById('save');
timer_input.addEventListener('input', check_min);
save_button.addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options);
