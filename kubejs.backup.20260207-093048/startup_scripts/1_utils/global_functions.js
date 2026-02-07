/* priority: 10 */
global.particleBurst = (entity, particleId, count, speed, spread, yOverride) => {
	spread = spread || 0; speed = speed || 0;
	entity.level.spawnParticles(particleId, true, entity.x, yOverride || entity.y + entity.eyeHeight / 3 * 2, entity.z, spread, spread, spread, count, speed);
}

global.particleBurstBlock = (level, x, y, z, particleId, count, speed, spread) => {
	level.spawnParticles(particleId, true, x+0.5, y+0.5, z+0.5, spread, spread, spread, count, speed);
}

global.particleBurstBlock2 = (block, particleId, count, speed, spread) => {
	const {x, y, z, level} = block;
	level.spawnParticles(particleId, true, x+0.5, y+0.5, z+0.5, spread, spread, spread, count, speed);
}

const modeMap = {
	"static": "",
	"spread": "10000000000000",
	"gather": "-10000000000000"
};
global.particleRing = (mode, count, delay, dist, entity, particleId, speed, yOverride) => {
	let {x, y, z, level, eyeHeight} = entity;
	yOverride = yOverride || 0;

	for(let i = 0, counter = 0; i < count; i++) {
		server.scheduleInTicks(delay*i, () => {
			counter++;
			level.runCommandSilent(`execute rotated ${counter * 360/count} 0 positioned ${x} ${y+eyeHeight/4+yOverride} ${z} run particle ${particleId} ^ ^ ^${dist} ^ ^ ^${modeMap[mode]} ${(speed*0.00000000000001).toFixed(18)} 0 force`)
		})
	}
}

global.particleBridge = (thisEntity, nextEntity, particleId) => {
	const {x:startX, eyeY:startY, z:startZ} = thisEntity;
	const {x:endX, eyeY:endY, z:endZ} = nextEntity;
	const dist = thisEntity.distanceToEntity(nextEntity);

	for (let i = 0; i < dist; i += 1) {
		let t = i/dist;
		let x = startX + (endX-startX) * t;
		let y = startY-0.5 + (endY-startY) * t;
		let z = startZ + (endZ-startZ) * t;

		thisEntity.level.spawnParticles(particleId, true, x, y, z, 0, 0, 0, 1, 0);
	}
}

global.particleBridge2 = (level, startX, startY, startZ, endX, endY, endZ, particleId) => {
	const dist = Math.hypot(startX-endX, startY-endY, startZ-endZ);

	for (let i = 0; i < dist; i += 1) {
		let t = i/dist;
		let x = startX + (endX-startX) * t;
		let y = startY-0.5 + (endY-startY) * t;
		let z = startZ + (endZ-startZ) * t;

		level.spawnParticles(particleId, true, x, y, z, 0, 0, 0, 1, 0);
	}
}

global.randomSelect = (reference) => {
	const keys = reference.length ? reference : Object.keys(reference);
	return keys[Math.floor(Math.random() * keys.length)];
}

global.within = (min, max, value) => (value >= min && value < max)

global.throttle = (temp => (entity, interval, identifier) => {
	const {uuid, age: now} = entity;
	const key = `${uuid}${identifier}`;
	const previous = temp[key];
	if(previous == null || now - previous >= interval || now < previous){
		temp[key] = now;
		return false;
	};
	return true
})({})

global.sound = (entity, soundId, volume, pitch, shift) => {
	shift = shift || 0.1; pitch = pitch || 1; volume = volume || 1;
	const {level, x, y, z} = entity;
	level.playSound(null, x, y, z, soundId, "master", volume, pitch);
}

global.shocking = (user, thisEntity, maxChain, chainRadius) => {
	const {level} = user;
	const attackNearbyEntities = (thisEntity, depth) => {
		if(depth == 0) return;
		const entities = level.getEntitiesWithin(thisEntity.boundingBox.inflate(chainRadius))
		if(entities.length <= 0) return;
		const nextEntity = entities.filter(e => 
			e.isLiving() && !e.hasEffect("kubejs:timer2") && e != user
		).getFirst();

		server.scheduleInTicks(2, () => {
			nextEntity.attack("lightningBolt", 3);
			nextEntity.potionEffects.add("kubejs:timer2", 60, 0, true, false);

			nextEntity.potionEffects.add("glowing", 10, 0, true, false);
			global.sound(nextEntity, "block.soul_sand.place", 1.5, 1.8, 0.2);
			global.particleBridge(thisEntity, nextEntity, "end_rod");

			attackNearbyEntities(nextEntity, depth - 1);
		})
	};
	attackNearbyEntities(thisEntity, maxChain);
}

global.advancedRayTrace = (entity, distance) => {  /* Credit: Squoshi */
	const { level } = entity;
	const eyePos = entity.eyePosition;
	const viewVec = entity.getViewVector(1);
	const endPos = eyePos.add(viewVec.x() * distance, viewVec.y() * distance, viewVec.z() * distance);
	const aabb = AABB.of(eyePos.x(), eyePos.y(), eyePos.z(), endPos.x(), endPos.y(), endPos.z());
	const eyePosition = entity.getEyePosition(1);

	const ray = $ProjectileUtil.getEntityHitResult(
		level, entity,
		eyePos, endPos,
		aabb, (e) => !e.isSpectator(), 0
	);

	const clip = new ClipContext(
		eyePosition,
		eyePosition.add(entity.getLookAngle().scale(distance)),
		"collider", "none",
		entity
	);
	const hit_pos = level.clip(clip).getBlockPos();

	if (ray == null) {
		return {
			block: hit_pos ? level.getBlock(hit_pos) : null,
			entity: null
		}
	}
	return {
		block: level.getBlock(hit_pos),
		entity: ray.entity
	}
}

global.advancedRayTraceEntity = (entity, distance) => {  /* Credit: Squoshi */
	const eyePos = entity.eyePosition;
	const viewVec = entity.getViewVector(1);
	const endPos = eyePos.add(viewVec.x() * distance, viewVec.y() * distance, viewVec.z() * distance);
	const aabb = AABB.of(eyePos.x(), eyePos.y(), eyePos.z(), endPos.x(), endPos.y(), endPos.z());

	const ray = $ProjectileUtil.getEntityHitResult(
		entity.level, entity,
		eyePos, endPos,
		aabb,
		(e) => !e.isSpectator(), 0
	);

	return ray == null ? null : ray.entity;
}

global.advancedRayTraceBlock = (entity, distance) => {  /* Credit: Squoshi */
	const { level } = entity, eye_pos = entity.getEyePosition(1);

	const clip = new ClipContext(
		eye_pos,
		eye_pos.add(entity.getLookAngle().scale(distance)),
		"collider", "none",
		entity
	);

	return level.clip(clip)
}

global.updateMaxHealth = (player, count) => {
	Utils.server.scheduleInTicks(1, () => {
		count = count || 0;
		const {persistentData: pData, stages} = player;
		const {basehealth, death_count} = pData;
		const limited_lives_count = (stages.has("no_limited_lives") || death_count == null) ? 0 : death_count*0.2;
		const value = JavaMath.clamp(basehealth - limited_lives_count + count, 6, 40);

		pData.basehealth += count;
		player.setAttributeBaseValue("minecraft:generic.max_health", value);
		player.health += count;
	})
}

global.isNearHome = (player, dist) => {
	const {respawnPosition} = player;
	if(!respawnPosition) return false;
	const {x: rx, y: ry, z: rz} = respawnPosition;
	const {x, y, z} = player;
	if(Math.hypot(x-rx, y-ry, z-rz) <= dist) return true;
	return false;
}

global.checkFullArmor = (entity) => {
	return entity.armorSlots.find(a => a.isEmpty()) == null;
}

global.blockHit = (entity, dist) => {  /* Credit: Squoshi */
	const {level} = entity;
	const eyePosition = entity.getEyePosition(1);
	const clip = new ClipContext(
		eyePosition, 
		eyePosition.add(entity.getLookAngle().scale(dist)), 
		"collider", "none",
		entity
	);
	return level.clip(clip);
}

global.bounce = (entity, direction, motionX, motionY, motionZ) => {
	const dirMap = {
        x: [-0.6, 0.7, 0.7],
        y: [0.7, -0.6, 0.7],
        z: [0.7, 0.7, -0.6]
    };
    const data = dirMap[direction.axis];

    entity.setMotion(motionX*data[0], motionY*data[1], motionZ*data[2]);

	global.particleBurst(entity, "item_slime", 2);
    global.sound(entity, "block.slime_block.place", 0.25, 1.1);
}

const { ITEM, BLOCK } = ParticleTypes
global.itemParticle = (id) => new ItemParticleOption(ITEM, id)
global.blockParticle = (id) => new BlockParticleOption(BLOCK, Block.get(id).defaultBlockState())
global.blockStateParticle = (state) => new BlockParticleOption(BLOCK, state)