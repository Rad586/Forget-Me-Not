function knock_knock(e, sound) {
	const {player} = e;
	if(e.hand == "off_hand" || !player.isCrouching()) return;

	const {block} = e, {x, y, z} = block;
	if(player.distanceToSqr(new Vec3(x, y, z)) > 4.86) return;

	e.level.playSound(null, x+0.5, y+0.5, z+0.5, sound, "master", 1.8, 1.8);
}

Ingredient.of("#minecraft:wooden_doors").itemIds.forEach(key => {
	BlockEvents.leftClicked(key, e => knock_knock(e, "block.wood.place"))
})
BlockEvents.leftClicked("minecraft:iron_door", e => knock_knock(e, "block.metal.hit"))