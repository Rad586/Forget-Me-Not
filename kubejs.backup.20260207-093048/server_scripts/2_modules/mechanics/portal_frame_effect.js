BlockEvents.rightClicked("minecraft:end_portal_frame", e => {
	if(e.hand == "off_hand" || e.item.id != "minecraft:ender_eye") return;
	const {block, level} = e;
	if(block.properties.eye == "true") return;

	let {x, y, z} = block;
	x += 0.5; y += 0.85; z += 0.5;
	level.spawnParticles("portal", true, x, y, z, 0, 0, 0, 8, 0.65);
	level.spawnParticles("portal", true, x, y, z, 0, 0, 0, 6, 0.3);
    level.spawnParticles("witch", true, x, y, z, 0.1, 0, 0.1, 3, 2);
    level.spawnParticles("portal", true, x, y, z, 0, 0, 0, 2, 0.05);
	level.spawnParticles("falling_obsidian_tear", true, x, y+0.5, z, 0.02, 0.75, 0.02, 4, 0);
})