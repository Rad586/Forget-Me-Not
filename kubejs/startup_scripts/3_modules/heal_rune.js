function heal_rune(context) {
    const { entity } = context;
    const { level } = entity;

    if (level.isClientSide()) return;
    global.trinkets_common["bless"].action(
        level, entity, null,
        global.trinketAmount(entity, "bless"),
        context.healAmount
    )
}