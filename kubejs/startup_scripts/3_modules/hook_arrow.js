function hook_arrow(context) {
	const {result: {location}, entity: {owner}, entity} = context;
	if(!owner || owner.level.isClientSide()) return;

	const x = location.x(), y = location.y() + 0.5, z = location.z();
	const {x: px, y: py, z:pz} = owner;

	owner.setMotion(Math.min(20, (x-px))/4, Math.min(10, (y-py))/4, Math.min(20, (z-pz))/4);
	owner.hurtMarked = true;
	entity.discard();

	global.particleBridge2(entity.level, x, y, z, px, py, pz, "end_rod");
}