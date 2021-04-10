const socket = io();

socket.on("datainfo", (data) => {
    let usoCpu = $("#usoCpu");
    let usoRam = $("#usoRam");
    let uptime = $("#uptime");
    try {
        usoCpu.empty().append(
            `<h5>Uso de backend: ${data.usoCpu}</h5>`
        );
        usoRam.empty().append(
            `<h5>Uso de ram: ${data.usoRam}</h5>`
        );
        uptime.empty().append(
            `<h5>Uptime: ${data.uptime}</h5>`
        );
    } catch (err) {
        console.log(err)
    }
});