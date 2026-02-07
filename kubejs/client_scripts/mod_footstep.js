const FootstepsConfig = Java.loadClass('dev.footstepstrail.config.FootstepsConfig').getInstance()
const { STEPS, TIME } = Java.loadClass('dev.footstepstrail.config.TrackingMode')

function modFootstep(player) {
    if(player.age % 5) return;
    const steps_mode = FootstepsConfig.getTrackingMode() == STEPS;

    if (player.isCrouching() || !player.isOnGround()) {
        if (steps_mode) FootstepsConfig.setTrackingMode(TIME)
    }
    else if (!steps_mode) FootstepsConfig.setTrackingMode(STEPS)
}