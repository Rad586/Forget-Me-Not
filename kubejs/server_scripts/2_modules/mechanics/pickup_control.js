ItemEvents.canPickUp(e => {
    const { player } = e;
    if (player.age % 3) {
        e.cancel()
    }
    else if (
        player.persistentData.auto_pickup == false &&
        !player.isCrouching()
    ) {
        e.cancel()
    }
})