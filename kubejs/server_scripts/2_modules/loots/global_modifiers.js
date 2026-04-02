function global_modifiers(e) {
	const pchests = [
		"probablychests:lush_chest", "probablychests:normal_chest", "probablychests:rocky_chest",
		"probablychests:stone_chest", "probablychests:gold_chest", "probablychests:shadow_chest",
		"probablychests:nether_chest", "probablychests:ice_chest", "minecraft:nether_portal"
	];
    e.addLootTypeModifier(LootType.values())
		.removeLoot(Ingredient.of(/copper/)) /* nuke copper */
		.replaceLoot(Ingredient.of("#fmn:meat"), "kubejs:meat", true) /* meat unify */
		.replaceLoot(Ingredient.of("#fmn:cooked_meat"), "kubejs:cooked_meat", true)
		.replaceLoot(Ingredient.of("#fmn:cooked_meat_sliced"), "kubejs:cooked_meat_sliced", true)
		.replaceLoot(Ingredient.of("#fmn:cooked_meat_sliced"), "kubejs:meat_sliced", true)
		.replaceLoot(Ingredient.of("#minecraft:boats"), "minecraft:oak_boat") /* boat unify */
		.replaceLoot("minecraft:rabbit_hide", "minecraft:leather") /* leather unify */
		.replaceLoot(pchests, "minecraft:chest")
		.removeLoot("minecraft:saddle")
		.removeLoot("minecraft:experience_bottle")

	e.addLootTypeModifier(LootType.CHEST, LootType.UNKNOWN).removeLoot(Ingredient.of(/fishofthieves/))
}