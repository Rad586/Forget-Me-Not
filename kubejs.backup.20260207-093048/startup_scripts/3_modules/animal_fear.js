function animal_fear(entity) {
    const {server, level, x, y, z} = entity;

    for(let i = 0; i < 4; i++) {
        let dx = (i % 2 ? 1 : -1);
        let dz = (i < 2 ? 1 : -1);
        let aabb = AABB.of(x+16*dx, y-2, z+16*dz, x, y+2, z);
        server.scheduleInTicks(i, () => {
            const entities = level.getEntitiesWithin(aabb).filter(e => e.isAnimal());
            entities.forEach(e => e.attack(0));
        })
    }
}