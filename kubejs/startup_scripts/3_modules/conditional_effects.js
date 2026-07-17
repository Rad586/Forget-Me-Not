/* somehow giving direct result always being treated as FALSE */
const banned_effects = [
    "effect.minecraft.hunger", "effect.minecraft.saturation", 
    "effect.rottencreatures.freeze"
]
function conditional_effects(context) {
    const id = context.effect.descriptionId;
    const day = context.entity.level.getDayTime() / 24000
    return (
        (id == "effect.minecraft.bad_omen" && day < 32) || 
        banned_effects.includes(id)
    ) ? false : true 
}