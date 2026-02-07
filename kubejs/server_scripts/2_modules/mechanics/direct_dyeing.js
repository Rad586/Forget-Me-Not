const hexToRgb = (hex) => {
	hex = hex.toString().replace("#", "");

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return new Vec3f(r / 255, g / 255, b / 255);
};
const { colored_blocks } = global;

colors.forEach(color => {
	log_types.forEach(log => {
		const temp = `${color}_${log}`;
		colored_blocks[`minecraft:${log}_leaves`] = ["kubejs", `${log}_leaves`];
		colored_blocks[`kubejs:${temp}_leaves`] = ["kubejs", `${log}_leaves`];
		colored_blocks[`kubejs:${temp}_leaf_pile`] = ["kubejs", `${log}_leaf_pile`];
	})
	colored_blocks["minecraft:terracotta"] = ["minecraft", "terracotta"];
	colored_blocks["minecraft:glass"] = ["minecraft", "stained_glass"];
	colored_blocks["minecraft:glass_pane"] = ["minecraft", "stained_glass_pane"];
	colored_blocks["minecraft:shulker_box"] = ["minecraft", "shulker_box"];
	colored_blocks["minecraft:candle"] = ["minecraft", "candle"];
})

Object.keys(colored_blocks).forEach(key => {
	const data = colored_blocks[key];
	const mod = data[0], suffix = data[1];
	BlockEvents.rightClicked(key, e => {
		const { hand, player } = e;
		if (hand == "off_hand" || !player.isCrouching()) return;

		const { item: { id, item }, block, level, facing } = e;
		if (!(item instanceof DyeItem)) return;

		const color = id.replace("minecraft:", "").replace("_dye", "");
		if (block.id.includes(`${color}_`)) return;
		const { entityData, x, y, z } = block;

		e.item.count--;
		const seperate = mod.includes(":") ? "." : ":";
		block.set(`${mod}${seperate}${color}_${suffix}`, block.properties);
		if (entityData) block.setEntityData(entityData);

		global.sound(player, "block.flowering_azalea.hit", 2, 1.8);
		player.swing();

		const shape = block.blockState.getCollisionShape(level, block.pos);
		if (shape.empty) return;
		e.server.scheduleInTicks(1, () => {
			const { xsize, ysize, zsize } = shape.bounds();

			const facingMap = {
				"east": [xsize / 2 + 0.15, 0, 0, 0, ysize, zsize], "west": [-xsize / 2 - 0.15, 0, 0, 0, ysize, zsize],
				"south": [0, 0, zsize / 2 + 0.15, xsize, ysize, 0], "north": [0, 0, -zsize / 2 - 0.15, xsize, ysize, 0],
				"up": [0, ysize / 2 + 0.15, 0, xsize, 0, zsize], "down": [0, -ysize / 2 - 0.15, 0, xsize, 0, zsize]
			};
			const data = facingMap[facing];
			level.spawnParticles(
				new DustParticleOptions(hexToRgb(Color[`${color.toUpperCase()}_DYE`].createTextColorJS()), 0.6), true,
				x + data[0] + 0.5, y + data[1] + ysize / 2, z + data[2] + 0.5,
				data[3] * 0.18, data[4] * 0.18, data[5] * 0.18,
				6, 0
			)
		})
	})
})

colors.forEach(c => ItemEvents.rightClicked(`minecraft:${c}_dye`, e => {
	if (e.player.isCrouching()) e.cancel()
}))