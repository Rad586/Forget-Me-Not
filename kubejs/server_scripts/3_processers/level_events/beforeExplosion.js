let processing = false
LevelEvents.beforeExplosion(e => {
    if (processing || !e.level.isOverworld()) return;
    processing = true;
    const { level, exploder, x, y, z, size } = e;

    try {
        if (exploder instanceof Creeper) {
            creeper_explosion(level, exploder, x, y, z, size);
            e.cancel()
        } else if (size < 4) {
            small_explosion(level, size, x, y, z);
            e.cancel()
        }
    } finally {
        processing = false
    }
})