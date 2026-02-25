/* partial code from Andromeda(https://modrinth.com/mod/andromeda) */
function auto_plant(item_entity, dist) {
	if (dist < 0.9) return;
	const { item: stack } = item_entity;
	const { item } = stack, { block } = item;
	if (!block || !(block instanceof BushBlock)) return;

	const { level, eyePosition: pos } = item_entity;
	item.place(new BlockPlaceContext(
		level, null, null, stack,
		level.clip(new ClipContext(
			pos, pos.add(0, -0.5, 0),
			"collider", "none", item_entity
		))
	))
}