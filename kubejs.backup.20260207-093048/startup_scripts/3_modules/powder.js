function extinguish_effect(level, x, y, z) {
	level.spawnParticles("minecraft:smoke", true, x, y, z, 0.25, 0.1, 0.25, 8, 0);
	level.playSound(null, x, y, z, "minecraft:block.fire.extinguish", "master", 0.14, 0.9 + Math.random()*0.3)
}
function powder_extinguish(level, block, x, y, z) {
	if(!block.hasTag("minecraft:fire")) return;
	block.set("minecraft:air");
	extinguish_effect(level, x, y, z)
}

function powder_tick(entity) {
	const {level, age} = entity;
	if(level.isClientSide() || age % 3) return;

	const {x, y, z} = entity, spread = 0.15*age-0.45;
	level.spawnParticles("minecraft:poof", true, x, y, z, spread, spread, spread, 3, 0.06);

	if(age <= 12) return;
	entity.discard();
	level.spawnParticles("minecraft:poof", true, x, y, z, 0.4, 0.4, 0.4, 8, 0.3);
}
function powder_entity(context) {
	const {entity} = context, {level} = entity;
	if(level.isClientSide()) return;
	const {entity: target} = context.result;

	const {x, y, z} = entity;
	target.setDeltaMovement(
		entity.deltaMovement.scale(3 / Math.pow(entity.age+1, 2))
	);
	target.resetFallDistance();
	entity.hurtMarked = true;
	entity.discard();

	if(target.isOnFire()) {
		target.extinguish();
		extinguish_effect(level, x, y, z)
	}
	else powder_extinguish(level, target.block, x, y, z);

	level.spawnParticles("minecraft:snowflake", true, x, y, z, 0, 0, 0, 3, 0.08)
}
function powder_block(context) {
	const {entity, result} = context, {level} = entity;
	const block = level.getBlock(result.blockPos)[result.direction];

	const {x, y, z} = entity;
	powder_extinguish(level, block, x, y, z)
	entity.discard();

	level.spawnParticles("minecraft:snowflake", true, x, y, z, 0, 0, 0, 3, 0.08);
}

function powder_onfire(entity) {
	const {level} = entity;
	if(level.isClientSide() || !entity.isOnFire()) return true;

	const {block, x, y, z} = entity;
	const temp = powder_extinguish;

	temp(level, block, x, y, z);
	temp(level, block.east, x, y, z);
	entity.server.scheduleInTicks(1, () => {
		temp(level, block.west, x, y, z);
		temp(level, block.north, x, y, z);
		temp(level, block.south, x, y, z);
	});

	entity.discard();
	return true;
}