function door_push(e, isTrapdoor) {
	const {player, hand} = e;
	if(hand == "off_hand" || player.isCrouching()) return;

	const {block: {pos, properties: {open, facing}}} = e;

	const aabb = AABB.ofBlock(pos);
    const dist = player.distanceToSqr(aabb.center);
    const maxDist = isTrapdoor ? 0.88 : 2.65;

    const minScale = isTrapdoor ? 0.12 : 0.3;
    const scale = Math.min(minScale, 0.35 * dist/maxDist);
	if(scale < minScale) return;

	const index = isTrapdoor ? -1 : 1;
	const dir = open == "false" ? 1 : -1;
	const result = scale*dir*index;
	const facingMap = {
		"east": [result, 0, 0],
		"west": [-result, 0, 0],
		"south": [0, 0, result],
		"north": [0, 0, -result]
	};
	const data = facingMap[facing];

	e.level.getEntitiesWithin(aabb).forEach(entity => {
		entity.addMotion(data[0], data[1], data[2]);
		entity.hurtMarked = true;
	})
}

Ingredient.of("#minecraft:wooden_trapdoors").itemIds.forEach(key => {
	BlockEvents.rightClicked(key, e => door_push(e, true))
});
Ingredient.of("#minecraft:wooden_doors").itemIds.forEach(key => {
	BlockEvents.rightClicked(key, e => door_push(e, false))
})