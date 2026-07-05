// ─── JSPSYCH INIT ─────────────────────────────────────────────────────────────

let experimentEnded     = false;
let blurCount           = 0;   // increments each time the window loses focus
let fullscreenExitCount = 0;   // increments each time the user leaves fullscreen

const jsPsych = initJsPsych({
    on_data_update: function(data) {
        jsPsych.data.addDataToLastTrial({
            blur_count:            blurCount,
            fullscreen_exit_count: fullscreenExitCount
        });
    },
    on_interaction_data_update: function(data) {
        if (data.event === 'blur' && !experimentEnded) {
            blurCount++;
            jsPsych.pauseExperiment();
            alert("The experiment is paused. If necessary please return to fullscreen by pressing F11 on your keyboard. Note that you will not be paid if you are not completely engaged with the experiment.");
        }
        if (data.event === 'focus' && !experimentEnded) {
            jsPsych.resumeExperiment();
        }
    }
});

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement && !experimentEnded) {
        fullscreenExitCount++;
    }
});

const subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID') || 'not_provided';
const study_id   = jsPsych.data.getURLVariable('STUDY_ID')     || 'not_provided';

// Device detection
const ua = navigator.userAgent || '';
const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua);
const isTouchOnly = (navigator.maxTouchPoints > 1) && (window.screen.width < 1024);
const device_type = (isMobileUA || isTouchOnly) ? 'mobile_or_tablet' : 'desktop';

jsPsych.data.addProperties({ subject_id, study_id, device_type });

// Pavlovia Init
timeline.push({ type: jsPsychPavlovia, command: 'init' });
