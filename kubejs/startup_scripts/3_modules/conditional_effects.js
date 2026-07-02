/* somehow giving direct result always being treated as FALSE */
function conditional_effects(context) {
    const id = context.effect.descriptionId;
    return (
        (id == "effect.minecraft.bad_omen" && context.entity.level.getDayTime() / 24000 < 32) || 
        ["effect.minecraft.hunger", "effect.minecraft.saturation"].includes(id)
    ) ? false : true 
}