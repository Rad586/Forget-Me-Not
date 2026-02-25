function small_explosion(level, size, x, y, z) {
    level.createExplosion(x, y, z)
        .strength(size)
        .damagesTerrain(false)
        .causesFire(false)
        .explode()
}