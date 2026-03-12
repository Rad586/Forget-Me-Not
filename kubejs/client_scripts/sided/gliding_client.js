const ClipContext = Java.loadClass("net.minecraft.world.level.ClipContext")
let can_glide = false
let previous_press = false

function gliding_client(player, level) {
    const now_press = Client.options.keyJump.isDown();
    const needs_change = now_press && !previous_press;
    previous_press = now_press;

    if ((!can_glide && !needs_change) ||
        player.deltaMovement.y() > 0 ||
        !level.getFluidState(player.blockPosition()).isEmpty() ||
        player.isFallFlying() ||
        player.horizontalCollision ||
        player.onClimbable() ||
        player.isPassenger() ||
        player.invulnerableTime > 0
    ) {
        can_glide = false;
        return
    };

    const { eyePosition: pos } = player;
    const high_enough = level.clip(new ClipContext(pos, pos.add(0, -4, 0),
        "collider", "none", player)).type == "MISS";

    if (can_glide && (!high_enough || needs_change)) {
        can_glide = false;
        player.sendData("gliding");
        level.playLocalSound(pos, "item.armor.equip_generic", "players", 1.08, 0.5, true)
    } else if (!can_glide && high_enough && needs_change) {
        can_glide = true;
        level.playLocalSound(pos, "item.armor.equip_generic", "players", 1.08, 0.7, true)
    };

    if (!can_glide) return;
    const m = player.lookAngle;
    player.setDeltaMovement(new Vec3(m.x() * 0.2, -0.05, m.z() * 0.2))
}