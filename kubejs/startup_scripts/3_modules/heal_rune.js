function heal_rune(context) {
    const { entity } = context;
    const { level } = entity;

    if (level.isClientSide()) return;
    global.trinkets["bless"](
        level, entity, null,
        global.trinketAmount(entity, "bless"),
        context.healAmount
    )
}