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
	const offset = Math.random() * 6.28;

	for (let i = 0; i < count; i++) {
		let angle = (i / count) * 6.28 + offset;

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
	const offset = Math.random() * 6.28;

	for (let i = 0; i < count; i++) {
		let angle = (i / count) * 6.28 + offset;

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

global.particleWind = (level, count, entity, particleId, speed, spread) => {
	const vec = entity.getViewVector(1).scale(-1);
	const { x, y, z, eyeHeight } = entity;

	for (let i = 0; i < count; i++) {
		let vx = vec.x() * speed + (Math.random() - 0.5) * spread;
		let vy = (Math.random() - 0.5) * spread
		let vz = vec.z() * speed + (Math.random() - 0.5) * spread;

		level.spawnParticles(
			particleId, true,
			x, y + (eyeHeight / 3 * 2), z,
			vx, vy, vz,
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

global.particleBridge2 = (level, startX, startY, startZ, endX, endY, endZ, particleId, density) => {
	const dist = Math.hypot(startX - endX, startY - endY, startZ - endZ);

	for (let i = 0; i < dist; i += density) {
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

global.reloadStartupScript = () => KubeJS.getStartupScriptManager().reload(null)
global.reloadClientScript = () => KubeJS.PROXY.reloadClientInternal()
global.reloadServerScript = () => ServerScriptManager.instance
	.reloadScriptManager(Utils.server.getResourceManager())

global.toInt = (value) => Integer.valueOf(value.toString())

global.totemAnimation = (player, item) => player.sendData("totemAnimation", { item: item })

/* credit: LootJS(https://www.curseforge.com/minecraft/mc-mods/lootjs) */
global.structureStartAt = (registry, manager, pos, id, inStructure) => {
	const strcure = registry.get(new ResourceLocation(id))
	return inStructure ?
		manager.getStructureWithPieceAt(pos, strcure) :
		manager.getStructureAt(pos, strcure)
}

global.useBlock = (level, player, block) => {
	const { pos } = block;
	const hitResult = new BlockHitResult(
		Vec3.ZERO,
		"up", pos, false);

	block.blockState.use(level, player, "main_hand", hitResult);
}

global.itemDamage = (stack/*, entity*/) => {
	const modifier_map = {
		"ADDITION": (m) => addition += m.getAmount(),
		"MULTIPLY_BASE": (m) => m_base += m.getAmount(),
		"MULTIPLY_TOTAL": (m) => m_total *= (1 + m.getAmount())
	};
	let addition = 0, m_base = 0, m_total = 1;

	const modifiers = stack
		.getAttributeModifiers("mainhand")
		.get(Attributes.ATTACK_DAMAGE);
	modifiers.forEach(modifier => {
		modifier_map[modifier.getOperation().name()](modifier)
	});

	const base = (1 + addition) * (1 + m_base) * m_total;
	/* const ench = EnchantmentHelper
		.getDamageBonus(stack, !entity ? null : entity.getMobType()); */
	return base/* + ench*/
}

global.getTimeDifficulty = (difficulty, worldDays, chunkDays, moonLight /*0 ~ 1*/) => {
	const d_map = {
		"easy": 1,
		"normal": 2,
		"hard": 3
	};

	const world_d = (Math.min(63, worldDays) * 24000 - 72000) / 5760000;
	const chunk_d1 = Math.min(1, (chunkDays * 24000) / 3600000)
		* (difficulty == "hard" ? 1 : 0.75);
	const chunk_d2 = chunk_d1 + Math.min(world_d, (moonLight || 0.5) / 4)
		* (difficulty == "easy" ? 0.5 : 1);

	return (0.75 + world_d + chunk_d2) * d_map[difficulty]
}

global.getBiomeAt = (level, pos) => String(level.getBiome(pos).unwrapKey().get().location())

// global.hasTrinket = (player, id) => TrinketsApi
// 	.getTrinketComponent(player).get()
// 	.isEquipped(Item.of(id).item)

global.getTrinkets = (player) => TrinketsApi
	.getTrinketComponent(player).get()
	.getAllEquipped().map(p => p.b)

global.mergedTrinkets = (player) => {
	const map = {};

	TrinketsApi
		.getTrinketComponent(player).get()
		.getAllEquipped().map(p => p.b)
		.forEach(stack => {
			const split = stack.idLocation.path.split("_rune_");
			const name = split[0], lvl = split[1];

			map[name] = (map[name] || 0) + lvl * stack.count;
		});

	return Object.keys(map).map(n => Item.of(`kubejs:${n}_rune_1`, map[n]))
}

global.trinketAmount = (player, name) => {
	let amount = 0;

	TrinketsApi
		.getTrinketComponent(player).get()
		.getAllEquipped().map(p => p.b)
		.forEach(stack => {
			const split = stack.idLocation.path.split("_rune_");
			const name2 = split[0], lvl = split[1];

			if (name2 == name) amount += stack.count * lvl;
		});

	return amount
}

global.setSecondsOnFire = (level, entity, seconds) => {
	entity.setSecondsOnFire(seconds);
	if (level.getBlock(entity.x, entity.y - 0.5, entity.z)
		.hasTag("minecraft:soul_fire_base_blocks")) {
		entity.fireType = "minecraft:soul"
	}
}

global.getEffects = entity => {
	const result = {};

	entity.activeEffects.forEach(effect => {
		const id = effect.descriptionId.slice(7).replace(".", ":");
		result[id] = {
			amplifier: effect.amplifier,
			duration: effect.duration
		}
	})

	return result
}

global.spawnEntity = (level, type, pos) =>
	EntityType.byString(type).get().spawn(
		level, null, null, null,
		pos,
		"command",
		true, false
	)

global.calculateDamage = (level, entity, source, damage) => {
	damage = CombatRules.getDamageAfterAbsorb(
		damage,
		entity.armorValue,
		entity.getAttribute("minecraft:generic.armor_toughness").getValue()
	);

	const resistance = entity.getEffect("minecraft:resistance");
	if (resistance) {
		damage *= 1 - (resistance.amplifier + 1) * 0.2
	};

	const difficulty = {
		"peaceful": (dmg) => 0,
		"easy": (dmg) => Math.min(dmg / 2 + 1, dmg),
		"normal": (dmg) => dmg,
		"hard": (dmg) => dmg * 1.5,
	};
	damage = source.scalesWithDifficulty() ? 
		difficulty[level.difficulty.getKey()](damage) : 
		damage

	/*const protection = EnchantmentHelper.getDamageProtection(entity.armorSlots, source)
	if (protection > 0) {
		damage = CombatRules.getDamageAfterMagicAbsorb(damage, protection)
	};*/

	return Math.max(0, damage - entity.absorptionAmount)
}

global.getBlockLoot = (level, player, item, block) => { /* triggers lootjs, be aware of loop */
	const { blockState } = block;
	const builder = new LootContextBuilder(level)
		.withParameter(LootContextParams.ORIGIN, new Vec3(
			block.x + 0.5,
			block.y + 0.5,
			block.z + 0.5
		))
		.withParameter(LootContextParams.BLOCK_STATE, blockState)
		.withParameter(LootContextParams.TOOL, item)
		.withOptionalParameter(LootContextParams.THIS_ENTITY, player);

	const context = builder.create(LootContextParamSets.BLOCK);
	return context
		.getLootTable(blockState.block.lootTable)
		.getRandomItems(context)
}