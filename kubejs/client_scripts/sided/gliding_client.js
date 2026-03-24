const ClipContext = Java.loadClass("net.minecraft.world.level.ClipContext")
const { CONTINUOUS, GROUND_ONLY } = Java.loadClass('dev.footstepstrail.config.FootprintPlacementMode')
let can_glide = false
let previous_press = false

function gliding_client(player, level) {
    const { input, deltaMovement: m } = player;
    const now_press = input.jumping;
    const needs_change = now_press && !previous_press;
    previous_press = now_press;

    if (!can_glide && !needs_change) return;

    function gliding(status, pitch) {
        can_glide = status;
        player.sendData("gliding", {status: status});
        FootstepsConfig.setPlacementMode(!status ? GROUND_ONLY : CONTINUOUS);
        if(pitch) level.playLocalSound(pos, "item.armor.equip_generic", "players", 1.08, pitch, true)
    };

    if ((needs_change || player.age % 3) && (
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