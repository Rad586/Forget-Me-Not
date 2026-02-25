let last_pressed = 0;
let holding = false;

function sitClient(player) {
    if (
        player.pitch < 60 || player.isSprinting() ||
        !player.isOnGround() || !player.feetBlockState.fluidState.isEmpty()
    ) return;

    const { keyShift } = Client.options;
    const pressing = keyShift.isDown();

    if (pressing && !holding) {
        if (Date.now() - last_pressed <= 300) {
            player.sendData("sit");
            last_pressed = 0
        } 
        else last_pressed = Date.now()
    };

    holding = pressing
}