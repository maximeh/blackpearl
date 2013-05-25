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
