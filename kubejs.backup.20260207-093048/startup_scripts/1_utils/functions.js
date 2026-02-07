/* priority: 5 */
function thunderbrand(entity, roll, delay) {
	const vec = entity.getViewVector(1);
	const ex = vec.x();
	const ez = vec.z();
	const ey = vec.y();
	const {x:px, y:py, z:pz, level} = entity;

	/* if(Math.abs(ey) > 0.85) return; */
	for(let i = 0, tick = 0; i < roll; i++){
		server.scheduleInTicks(i*delay, () => {
			tick++;
			const x = (2*tick+2)*ex + px;
			const y = (2*tick+0.5)*ey + py;
			const z = (2*tick+2)*ez + pz;

			if(entity.age % delay) return;
			let lightning_bolt = level.createEntity("minecraft:lightning_bolt");
			lightning_bolt.setPosition(x, y, z);
			lightning_bolt.spawn();
		})
	}
}

function ec_check(target, identifier) {
	if(target.level.isClientSide() || !target.isLiving() || global.throttle(target, 10, identifier)) return true;
}