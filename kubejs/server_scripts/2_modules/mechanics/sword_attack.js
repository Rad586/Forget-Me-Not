function dynamic_iframe(target, player, delay) {
    target.invulnerableTime = JavaMath.clamp(
        (delay * 2) - 1,
        player.hasEffect("strength") ? 10 : 5,
        20
    )
}
function dynamic_kb(target, mul) {
    target.setMotion(
        target.motionX * mul,
        target.motionY,
        target.motionZ * mul
    );
    target.hurtMarked = true
}
function fall_attack(level, player, target, fallDistance) {
    if (fallDistance < 4.76) return;

    player.resetFallDistance();
    target.attack(Math.min(fallDistance / 1.2, 10));
    player.setMotionY(0.4);
    player.hurtMarked = true;

    global.particleRing(level, 6, 0.3, player, "cloud", 0.1);
    global.sound(level, player, "block.wool.break");
}

function sword_attack(server, level, player, target) {
    if (!(player.mainHandItem.item instanceof SwordItem)) return;
    const delay = player.getCurrentItemAttackStrengthDelay(), mul = delay / 12.5;

    server.scheduleInTicks(1, () => {
        fall_attack(level, player, target, player.fallDistance);
        dynamic_iframe(target, player, delay);
        dynamic_kb(target, mul)
    })
}