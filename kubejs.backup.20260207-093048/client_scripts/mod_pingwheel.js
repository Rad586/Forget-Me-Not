/* data received from player loggedin processor, 
   refresh on joining new world */
const { HANDLER: PingwheelHandler } = Java.loadClass('nx.pingwheel.common.config.ClientConfig');
const PingwheelConfig = PingwheelHandler.getConfig();
NetworkEvents.dataReceived("pingchannel", e => {
    PingwheelHandler.getConfig().setChannel(e.data.channel);
    PingwheelHandler.save()
})

/* refresh on leaving default value */
/* executed in client_tick.js */
function modPingwheelRefresh() {
    if (!PingwheelConfig.getChannel().isEmpty()) return;
    PingwheelConfig.setChannel(Math.random().toFixed(6).slice(-6));
    PingwheelHandler.save()
}