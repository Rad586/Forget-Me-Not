/* priority: 10 */
global.particleBurst = (level, entity, particleId, count, speed, spread, yOverride) => {
	spread = spread || 0; speed = speed || 0;
	const { x, y, z, eyeHeight } = entity;
	const finalY = y + (eyeHeight / 3 * 2) + (yOverride || 0);

	level.spawnParticles(
		particleId, true, 
		x, finalY, z, 
		spread, spread, spread,
		count, speed
	)
}

global.particleBurstBlock = (level, x, y, z, particleId, count, speed, spread) => {
	spread = spread || 0; speed = speed || 0;

	level.spawnParticles(
		particleId, true, 
		x + 0.5, y + 0.5, z + 0.5, 
		spread, spread, spread, 
		count, speed
	)
}

global.particleRing = (level, count, dist, entity, particleId, speed, yOverride) => {
	const { x, y, z, eyeHeight } = entity;
	const finalY = y + (eyeHeight / 4) + (yOverride || 0);

	for (let i = 0; i < count; i++) {
		let angle = (i * 2 / count) * 3.14;

		let vx = Math.cos(angle) * speed;
		let vz = Math.sin(angle) * speed;

		level.spawnParticles(
			particleId, true,
			x + Math.cos(angle) * dist,
			finalY,
			z + Math.sin(angle) * dist,
			vx, 0, vz,
			0, 1
		)
	}
}

global.particleRingVertical = (level, count, dist, entity, particleId, speed, yOverride) => {
	const { x, y, z, eyeHeight } = entity;
	const finalY = y + (eyeHeight / 4) + (yOverride || 0);

	for (let i = 0; i < count; i++) {
		let angle = (i * 2 / count) * 3.14;

		let px = x + Math.cos(angle) * dist;
		let pz = z + Math.sin(angle) * dist;

		level.spawnParticles(
			particleId, true,
			px, finalY, pz,
			0, speed, 0,
			0, 1
		)
	}
}

global.particleBridge = (level, thisEntity, nextEntity, particleId) => {
	const { x: startX, eyeY: startY, z: startZ } = thisEntity;
	const { x: endX, eyeY: endY, z: endZ } = nextEntity;
	const dist = thisEntity.distanceToEntity(nextEntity);

	for (let i = 0; i < dist; i += 1) {
		let t = i / dist;
		let x = startX + (endX - startX) * t;
		let y = startY - 0.5 + (endY - startY) * t;
		let z = startZ + (endZ - startZ) * t;

		level.spawnParticles(particleId, true, x, y, z, 0, 0, 0, 1, 0);
	}
}

global.particleBridge2 = (level, startX, startY, startZ, endX, endY, endZ, particleId) => {
	const dist = Math.hypot(startX - endX, startY - endY, startZ - endZ);

	for (let i = 0; i < dist; i += 1) {
		let t = i / dist;
		let x = startX + (endX - startX) * t;
		let y = startY - 0.5 + (endY - startY) * t;
		let z = startZ + (endZ - startZ) * t;

		level.spawnParticles(particleId, true, x, y, z, 0, 0, 0, 1, 0);
	}
}

global.randomSelect = (reference) => {
	const keys = reference.length ? reference : Object.keys(reference);
	return keys[Math.floor(Math.random() * keys.length)];
}

global.within = (min, max, value) => (value >= min && value < max)

global.throttle = (temp => (entity, interval, identifier) => {
	const { uuid, age: now } = entity;
	const key = `${uuid}${identifier}`;
	const previous = temp[key];
	if (previous == null || now - previous >= interval || now < previous) {
		temp[key] = now;
		return false;
	};
	return true
})({})

global.sound = (level, entity, soundId, volume, pitch) => {
	pitch = pitch || 1; volume = volume || 1;
	level.playSound(null,
		entity.x, entity.y, entity.z,
		soundId, "master",
		volume, pitch
	)
}

global.shocking = (user, thisEntity, maxChain, chainRadius) => {
	const { level } = user;
	const attackNearbyEntities = (thisEntity, depth) => {
		if (depth == 0) return;
		const entities = level.getEntitiesWithin(thisEntity.boundingBox.inflate(chainRadius))
		if (entities.length <= 0) return;
		const nextEntity = entities.filter(e =>
			e.isLiving() && !e.hasEffect("kubejs:timer2") && e != user
		).getFirst();

		server.scheduleInTicks(2, () => {
			nextEntity.attack("lightningBolt", 3);
			nextEntity.potionEffects.add("kubejs:timer2", 60, 0, true, false);

			nextEntity.potionEffects.add("glowing", 10, 0, true, false);
			global.sound(level, nextEntity, "block.soul_sand.place", 1.5, 1.8);
			global.particleBridge(level, thisEntity, nextEntity, "end_rod");

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

global.advancedRayTraceEntity = (entity, dist) => {  /* Credit: Squoshi */
	const { eyePosition: pos, lookAngle } = entity;
	const endPos = pos.add(lookAngle.scale(dist));

	const ray = $ProjectileUtil.getEntityHitResult(
		entity.level, entity,
		pos, endPos,
		AABB.of(pos.x(), pos.y(), pos.z(),
			endPos.x(), endPos.y(), endPos.z()),
		e => !e.isSpectator(), 0
	);
	return ray == null ? null : ray.entity;
}

global.advancedRayTraceBlock = (entity, dist) => {  /* Credit: Squoshi */
	const { eyePosition: pos, lookAngle } = entity;
	const clip = new ClipContext(
		pos, pos.add(lookAngle.scale(dist)),
		"collider", "none", entity
	);
	return entity.level.clip(clip)
}

global.updateMaxHealth = (player, count) => {
	Utils.server.scheduleInTicks(1, () => {
		count = count || 0;
		const { persistentData: pData, stages } = player;
		const { basehealth, death_count } = pData;
		const limited_lives_count = (stages.has("no_limited_lives") || death_count == null) ? 0 : death_count * 0.2;
		const value = JavaMath.clamp(basehealth - limited_lives_count + count, 6, 40);

		pData.basehealth += count;
		player.setAttributeBaseValue("minecraft:generic.max_health", value);
		player.health += count;
	})
}

global.isNearHome = (player, dist) => {
	const { respawnPosition } = player;
	if (!respawnPosition) return false;
	const { x: rx, y: ry, z: rz } = respawnPosition;
	const { x, y, z } = player;
	if (Math.hypot(x - rx, y - ry, z - rz) <= dist) return true;
	return false;
}

global.checkFullArmor = (entity) => {
	return entity.armorSlots.find(a => a.isEmpty()) == null;
}

global.blockHit = (entity, dist) => {  /* Credit: Squoshi */
	const { level } = entity;
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
	const { level } = entity;

	entity.setMotion(motionX * data[0], motionY * data[1], motionZ * data[2]);

	global.particleBurst(level, entity, "item_slime", 2);
	global.sound(level, entity, "block.slime_block.place", 0.25, 1.1);
}

const { ITEM, BLOCK } = ParticleTypes
global.itemParticle = (id) => new ItemParticleOption(ITEM, id)
global.blockParticle = (id) => new BlockParticleOption(BLOCK, Block.get(id).defaultBlockState())
global.blockStateParticle = (state) => new BlockParticleOption(BLOCK, state)

global.reloadStartupScript = () => KubeJS.getStartupScriptManager().reload(null);
global.reloadClientScript = () => KubeJS.PROXY.reloadClientInternal();

global.toInt = (value) => Integer.valueOf(value.toString())

global.totemAnimation = (player, item) => player.sendData("totemAnimation", { item: item })