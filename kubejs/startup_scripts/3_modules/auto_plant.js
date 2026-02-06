/* code from Andromeda(https://modrinth.com/mod/andromeda) */
function auto_plant(entity, dist, server) {
	if (dist < 0.9) return;
	const { item } = entity, { item: { block } } = item;
	if (!block || !(block instanceof BushBlock)) return;

	const { level } = entity, pos = Vec3.atLowerCornerOf(entity.blockPosition());
	item.item.place(new BlockPlaceContext(
		level,
		null,
		null,
		item,
		level.clip(
			new ClipContext(
				pos.add(0.5, 0.5, 0.5),
				pos.add(0.5, -0.5, 0.5),
				"collider",
				"none",
				entity
			)
		)
	))
}