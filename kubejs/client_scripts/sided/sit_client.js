function sitClient(player) {
    if (player.pitch < 60 || 
        player.isSprinting() ||
        !player.isOnGround() || 
        !player.feetBlockState.fluidState.isEmpty() ||
        !pressedTwice("key_sit")
    ) return;

    player.sendData("sit")
}