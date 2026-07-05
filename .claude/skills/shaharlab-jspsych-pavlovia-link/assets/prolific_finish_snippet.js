// ─── PLACEHOLDERS — fill in before deploying ─────────────────────────────────
const COMPLETION_CODE = 'PASTE_PROLIFIC_CODE_HERE'; // from the study page on Prolific
const ON_PAVLOVIA     = true;                       // true when deployed; drive from environment for local runs

// Mark experiment as ended before exiting fullscreen
timeline.push({ type: jsPsychCallFunction, func: function() { experimentEnded = true; } });

// Exit fullscreen
timeline.push({ type: jsPsychFullscreen, fullscreen_mode: false });

// Pavlovia finish (skipped when running locally)
if (ON_PAVLOVIA) {
    var pavlovia_finish = {
        type: jsPsychPavlovia,
        command: "finish",
        participantId: subject_id,
        on_finish: function() {
            document.body.innerHTML = '<p style="text-align:center; color:#ffffff; font-family:Calibri,sans-serif; font-size:22px; margin-top:40vh;"> Please wait. You will be redirected back to Prolific in a few moments. <br><br> If you get a pop-up warning you "data may not be saved", you can click "leave", your data have already been saved.</p>';
            setTimeout(function() {
                location.href = 'https://app.prolific.com/submissions/complete?cc=' + COMPLETION_CODE;
                document.body.innerHTML = '<p style="color:#ffffff; font-family:Calibri,sans-serif; font-size:22px;">If you are not automatically redirected, please click here: <a href="https://app.prolific.com/submissions/complete?cc=' + COMPLETION_CODE + '" style="color:#FFD700;">https://app.prolific.com/submissions/complete?cc=' + COMPLETION_CODE + '</a></p><p style="color:#ffffff; font-family:Calibri,sans-serif;">If you get a pop-up warning you "data may not be saved", you can click "leave", your data have already been saved.</p>';
            }, 5000);
        }
    };
    timeline.push(pavlovia_finish);
}
