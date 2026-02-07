function global_modifiers(e) {
    e.addLootTypeModifier(LootType.values())
		.removeLoot(Ingredient.of(/copper/)) /* nuke copper */
		.replaceLoot(Ingredient.of("#fmn:meat"), "kubejs:meat", true) /* meat unify */
		.replaceLoot(Ingredient.of("#fmn:cooked_meat"), "kubejs:cooked_meat", true)
		.replaceLoot(Ingredient.of("#fmn:cooked_meat_sliced"), "kubejs:cooked_meat_sliced", true)
		.replaceLoot(Ingredient.of("#fmn:cooked_meat_sliced"), "kubejs:meat_sliced", true)
		.replaceLoot(Ingredient.of("#minecraft:boats"), "minecraft:oak_boat") /* boat unify */
		.replaceLoot("minecraft:rabbit_hide", "minecraft:leather") /* leather unify */
		.removeLoot("minecraft:saddle")
		.removeLoot("minecraft:experience_bottle")

	e.addLootTypeModifier(LootType.CHEST, LootType.UNKNOWN).removeLoot(Ingredient.of(/fishofthieves/))
}