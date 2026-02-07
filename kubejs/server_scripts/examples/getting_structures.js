//// Credit: TelepathicGrunt (www.curseforge.com/minecraft/mc-mods/wits)
// const {STRUCTURE_REGISTRY} = Java.loadClass('net.minecraft.core.Registry');
// function structuresAtPos(level, pos) {
// 	const structureManager = level.structureManager();
// 	const all = structureManager.getAllStructuresAt(pos);
// 	const registry = structureManager.registryAccess().registryOrThrow(STRUCTURE_REGISTRY);
// 	const result = [];
// 	all.forEach(key => result.push(registry.getKey(key)));

// 	return result;
// }

// function structuresAtFeet(entity) {
// 	return structuresAtPos(entity.level, entity.blockPosition())
// }

// ItemEvents.rightClicked(e => {
// 	e.server.tell(structuresAtPos(e.level, e.player.blockPosition()))
// 	e.server.tell(structuresAtPos(e.level, [e.player.x, e.player.y, e.player.z]))

// 	e.server.tell(structuresAtFeet(e.player))
// })