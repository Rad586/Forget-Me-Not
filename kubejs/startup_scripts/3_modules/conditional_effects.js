/* somehow giving direct result always being treated as FALSE */
function conditional_effects(context, nether_stage) {
    const id = context.effect.descriptionId
    return (
        (id == "effect.minecraft.bad_omen" && nether_stage != true) || 
        ["effect.minecraft.hunger", "effect.minecraft.saturation"].includes(id)
    ) ? false : true 
}