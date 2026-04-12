function catching_player(target) {
    if (target instanceof Player) {
        target.resetFallDistance();
        target.setMotionY(0.1);
        global.sound(target.level, target, "entity.player.big_fall", 0.8)
    }
}