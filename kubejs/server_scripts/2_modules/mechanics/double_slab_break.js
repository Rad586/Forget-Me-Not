/* Credit: Mango is Me! (https://discord.com/channels/303440391124942858/1048591172165189632/threads/1162917542625542294) */
global.Slabs.forEach(slab => {
	const { id } = slab, state = slab.defaultBlockState();

	BlockEvents.broken(id, e => {
		const { player, block } = e;
		if (player.isCrouching() || block.properties.type != "double") return;

		if (player.hasCorrectToolForDrops(state)) block.popItemFromFace(block.drops[0].id, "up");
		block.set(id, { type: player.rayTrace(4.5).hitY < block.y + 0.5 ? "top" : "bottom" });
		e.cancel()
	})
})