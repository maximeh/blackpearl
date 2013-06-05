/*
 Author:     Maxime Hadjinlian
             maxime.hadjinlian@gmail.com
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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

// Keep the list of domain "clean" (no http nor www)
function sanitize_list(ev) {
    // If user press Enter, we sanitize the list, otherwise, we don't care.
    if (ev.keyCode != 13) return;
    var idx = 0;
    var data_len = null;
    // Break the list
    clean_data = exclude_list.value.split('\n');
    data_len = clean_data.length;
    // Clean the list
    for (idx = 0; idx < data_len; idx++) {
        clean_data[idx] = cleanURL(clean_data[idx]);
    }
    exclude_list.value = clean_data.join('\n');
}

// Function to clean url
function cleanURL(url) {
    if(url.match(/http:\/\//)) {
        url = url.substring(7);
    }
    if(url.match(/^www\./)) {
        url = url.substring(4);
    }
    return url;
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
    // Force the list to be sanitized before saving it.
    sanitize_list({keyCode: 13});
    localStorage["exclude_list"] = exclude_list.value;
    set_status("Options Saved", 750);
}

// Restores timer_input value from localStorage
function restore_options() {
    var timer = localStorage["timer"];
    var exclude = localStorage["exclude_list"];
    if (!timer) timer = 15;
    if (!exclude) exclude = null;

    timer_input.value = timer;
    exclude_list.value = exclude;
}

var timer_input = document.getElementById("timer");
var exclude_list = document.getElementById("exclude_list");
var save_button = document.getElementById('save');

timer_input.addEventListener('input', check_min);
exclude_list.addEventListener('keypress', sanitize_list);
save_button.addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options);

