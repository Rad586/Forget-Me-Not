/* Idea from RightClickHarvest(https://www.curseforge.com/minecraft/mc-mods/rightclickharvest) */
function tryHarvest(level, player, block, pos, state, id, max_age, e) {
	if (block.properties.age < max_age) return;
	Block2.dropResources(state, level, pos, null);
	block.set(id);
	player.swing();
	level.playSound(null, pos, "item.bone_meal.use", "blocks", 1.1, 0.94);
	if(e) e.cancel()
}
global.Crops.forEach(crop => {
	const id = crop.getId();
	const max_age = id == "farmersdelight:tomatoes" ? 3 : crop.MAX_AGE;

	BlockEvents.rightClicked(id, e => {
		if (e.hand == "off_hand") return;
		const { level, block, player, server } = e;

		if (!player.isCrouching()) {
			tryHarvest(level, player, block, 
				block.pos, block.blockState, id, max_age, e)
		}
		else if (e.item.item instanceof HoeItem) {
			let around = [-1, 0, 1];
			around.forEach(m => {
				around.forEach(n => {
					server.scheduleInTicks(m + 2, () => {
						const nBlock = block.offset(m, 0, n);
						if (nBlock.id == id) {
							tryHarvest(level, player, nBlock, 
								nBlock.pos, nBlock.blockState, id, max_age)
						}
					})
				})
			})
		}
	})
})