/* somehow giving direct result always being treated as FALSE */
function conditional_effects(context, dragon_stage) {
    const id = context.effect.descriptionId
    return (
        (id == "effect.minecraft.bad_omen" && dragon_stage != true) || 
        ["effect.minecraft.hunger", "effect.minecraft.saturation"].includes(id)
    ) ? false : true 
}