const InventoryScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.InventoryScreen")
NetworkEvents.dataReceived("open_inv", e => Client.setScreen(new InventoryScreen(e.player)))