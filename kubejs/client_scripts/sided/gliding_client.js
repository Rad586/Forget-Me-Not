const ClipContext = Java.loadClass("net.minecraft.world.level.ClipContext")
const { CONTINUOUS, GROUND_ONLY } = Java.loadClass('dev.footstepstrail.config.FootprintPlacementMode')
let can_glide = false

function gliding_client(level, player, age) {
    const needs_change = pressedOnce("key_glide");
    if (!can_glide && !needs_change) return;

    function gliding(status, pitch) {
        can_glide = status;
        player.sendData("gliding", {status: status});
        FootstepsConfig.setPlacementMode(!status ? GROUND_ONLY : CONTINUOUS);
        if (pitch) {
            Client.soundManager.play(
                SimpleSoundInstance.forUI("item.armor.equip_generic", pitch, 0.68)
            )
        }
    };
    const { deltaMovement: m } = player;

    if ((needs_change || age % 3) && (
        m.y() > 0 ||
        player.horizontalCollision ||
        !level.getFluidState(player.blockPosition()).isEmpty() ||
        player.isFallFlying() ||
        player.onClimbable() ||
        player.isPassenger() ||
        player.invulnerableTime > 0 ||
        player.abilities.flying
    )) {
        gliding(false);
        return;
    }

    const { eyePosition: pos } = player;
    const high_enough = () => level.clip(new ClipContext(pos, pos.add(0, -4, 0),
        "collider", "none", player)).type == "MISS";

    if (can_glide && (needs_change || player.isOnGround())) {
        gliding(false, 0.7)
    }
    else if (!can_glide && needs_change && high_enough()) { //test
        gliding(true, 0.5)
    };

    if (!can_glide) return;
    player.setDeltaMovement(m.multiply(0.98, 0.5, 0.98))
}