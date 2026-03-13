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
    if (m.y() > 0 ||
        player.horizontalCollision ||
        !level.getFluidState(player.blockPosition()).isEmpty() ||
        player.isFallFlying() ||
        player.onClimbable() ||
        player.isPassenger() ||
        player.invulnerableTime > 0 ||
        player.abilities.flying
    ) {
        can_glide = false;
        FootstepsConfig.setPlacementMode(GROUND_ONLY);
        return
    };

    const { eyePosition: pos } = player;
    const high_enough = level.clip(new ClipContext(pos, pos.add(0, -4, 0),
        "collider", "none", player)).type == "MISS";

    function start_gliding() {
        can_glide = true;
        FootstepsConfig.setPlacementMode(CONTINUOUS);
        level.playLocalSound(pos, "item.armor.equip_generic", "players", 1.08, 0.7, true)
    };
    function end_gliding() {
        can_glide = false;
        player.sendData("gliding");
        FootstepsConfig.setPlacementMode(GROUND_ONLY);
        level.playLocalSound(pos, "item.armor.equip_generic", "players", 1.08, 0.5, true)
    };

    if (can_glide && (player.isOnGround() || needs_change)) {
        end_gliding()
    } 
    else if (!can_glide && high_enough && needs_change) {
        start_gliding()
    };

    if (!can_glide) return;
    player.setDeltaMovement(m.multiply(0.98, 0.5, 0.98))
}