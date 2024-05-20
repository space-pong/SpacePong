const connectButton = document.getElementById('connect');
const rumbleButton = document.getElementById('rumble');
const stopRumbleButton = document.getElementById('stopRumble');

let device;

connectButton.addEventListener('click', async () => {
    [device] = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x054c, productId: 0x0ce6 }]
    });

    if (!device) return;

    await device.open();
    console.log('Device opened:', device.productName);
});

rumbleButton.addEventListener('click', async () => {
    if (!device || !device.opened) {
        console.log('Device not connected or not opened');
        return;
    }
    sendRumble(device, 255, 255); // Strong rumble on both motors
});

stopRumbleButton.addEventListener('click', async () => {
    if (!device || !device.opened) {
        console.log('Device not connected or not opened');
        return;
    }
    sendRumble(device, 0, 0); // Stop rumble
});

async function sendRumble(device, strongMagnitude, weakMagnitude) {
    const outputReportId = 0x02; // For USB connection
    const reportData = new Uint8Array(47).fill(0); // Output report is 47 bytes long
    reportData[1] = strongMagnitude; // Strong motor
    reportData[2] = weakMagnitude; // Weak motor

    try {
        await device.sendReport(outputReportId, reportData);
        console.log('Rumble sent');
    } catch (error) {
        console.error('Failed to send rumble:', error);
    }
}
