const VariableHandler = Java.loadClass('de.keksuccino.fancymenu.customization.variables.VariableHandler')

NetworkEvents.dataReceived("auto_pickup", e => {
    VariableHandler.setVariable("auto_pickup", Boolean(e.data.status))
})
NetworkEvents.dataReceived("armor_set", e => {
    VariableHandler.setVariable("armor_set", (e.data.num + 1).toString())
})