function phantom_fireball(entity) {
    const {level} = entity;
    if(level.isClientSide()) return;

    const phantom = level.createEntity("minecraft:phantom");
    phantom.copyPosition(entity);
    phantom.spawn();

    const {x, y, z} = entity;
    level.spawnParticles('flash', true, x, y, z, 0, 0, 0, 1, 0);
    level.spawnParticles('end_rod', true, x, y, z, 0, 0, 0, 8, 0.2);
    entity.playSound("entity.phantom.hurt", 0.6, 1);
    entity.playSound("entity.firework_rocket.large_blast", 0.8, 0.7);
    entity.discard()
}

function explosion_fireball(entity) {
    const {level} = entity;
    if(level.isClientSide()) return;

    const {x, y, z} = entity;
    const explosion = level.createExplosion(x, y, z);
    explosion.strength(4);
    explosion.explode();

    entity.discard()
}

function fireball_force(level, entity, ex, ez, dir) {
    level.getEntitiesWithin(entity.boundingBox.inflate(3)).forEach(target => {
        if(!target.isLiving()) return;
        target.knockback(2, (ex-target.x)*dir, (ez-target.z)*dir);
        target.hurtMarked = true
    })
};
function repulsion_fireball(entity) {
    const {level} = entity;
    if(level.isClientSide()) return;

    const {x, y, z} = entity;
    fireball_force(level, entity, x, z, 1);

    entity.playSound("block.beacon.deactivate", 1, 0.86);
    level.spawnParticles('alessandrvenchantments:enderwave', true, x, y, z, 0, 0, 0, 1, 0);
    entity.discard()
};
function pull_fireball(entity) {
    const {level} = entity;
    if(level.isClientSide()) return;
    const {x, z} = entity;

    fireball_force(level, entity, x, z, -1);

    global.particleRing("gather", 12, 0, 4, entity, "dragon_breath", 3)
    entity.playSound("block.beacon.activate", 2, 2);
    entity.discard()
}

function dragon_fireball(entity) {
	const {level} = entity;
	if(level.isClientSide() || entity.tags.contains("kjsed")) return;
	entity.addTag("kjsed");

	for(let i = 0; i < 4 + Math.random()*4; i++) {
		let fireball = level.createEntity(
			global.randomSelect([
				"kubejs:explosion_fireball", "kubejs:phantom_fireball",
				"kubejs:pull_fireball", "kubejs:repulsion_fireball"
			])
		);
		fireball.copyPosition(entity);
	
		entity.server.scheduleInTicks(2 + random.nextInt(1, 4), () => {
			fireball.setDeltaMovement(entity.deltaMovement)
			fireball.addMotion(
				0.3 * (Math.random() > 0.5 ? 1 : -1) + Math.random()*0.4, 
				0, 
				0.3 * (Math.random() > 0.5 ? 1 : -1) + Math.random()*0.4
			)	
			fireball.spawn()
		})
	}
}