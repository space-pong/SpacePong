
export class DualSense {
  device;
  outputReportBuffer = new Uint8Array(47);
  isOutputBufferUpdated = false;

  async init() {
    if (!'hid' in navigator) {
      console.error("This browser does not support HID");
      return;
    }

    let devices = await navigator.hid.requestDevice({
      filters: [{ 'vendorId': 0x054C, 'productId': 0x0CE6 }]
    });

    this.device = devices[0];

    try {
      await this.device.open();
    } catch (error) {
      return false;
    }

    this.device.addEventListener("inputreport", async event => {
      const { data, device, reportId } = event;

      if (device.productId !== 0x0CE6) {
        return;
      }

      if (this.isOutputBufferUpdated) {
        this.outputReportBuffer[0] = 0xF0 | 0x0F;
        this.outputReportBuffer[1] = 0xF7;
        await this.device.sendReport(0x02, this.outputReportBuffer);
        this.isOutputBufferUpdated = false;
      }
      if (reportId == 0x01) {
        this._getInputData(data);
      }
    });
    return true;
  }

  _getInputData(data) {
    const buttons0 = data.getUint8(7);
    this.states.triangle = this._toBool(buttons0 & 0x80);
    this.states.circle = this._toBool(buttons0 & 0x40);
    this.states.cross = this._toBool(buttons0 & 0x20);
    this.states.square = this._toBool(buttons0 & 0x10);

    const dpad = buttons0 & 0x0f;
    this.states.dpadUp = this._toBool(dpad == 0 || dpad == 1 || dpad == 7);
    this.states.dpadDown = this._toBool(dpad == 3 || dpad == 4 || dpad == 5);
    this.states.dpadLeft = this._toBool(dpad == 5 || dpad == 6 || dpad == 7);
    this.states.dpadRight = this._toBool(dpad == 1 || dpad == 2 || dpad == 3);

    const buttons1 = data.getUint8(8)
    this.states.share = this._toBool(buttons1 & 0x10);
    this.states.option = this._toBool(buttons1 & 0x20);
    this.states.l3 = this._toBool(buttons1 & 0x40);
    this.states.r3 = this._toBool(buttons1 & 0x80);

    const buttons2 = data.getUint8(9);
    this.states.ps = this._toBool(buttons2 & 0x01);

    this.states.mute = this._toBool(buttons2 & 0x04);
    this.states.touchpad.pressed = this._toBool(buttons2 & 0x02);

    this.states.gyro[0] = data.getUint8(16);
    this.states.gyro[1] = data.getUint8(18);
    this.states.gyro[2] = data.getUint8(20);
    this.states.accel[0] = data.getUint8(22);
    this.states.accel[1] = data.getUint8(24);
    this.states.accel[2] = data.getUint8(26);

    //Axes
    this.states.ls.x = this._normalizeAxis(data.getUint8(0));
    this.states.ls.y = this._normalizeAxis(data.getUint8(1));
    this.states.rs.x = this._normalizeAxis(data.getUint8(2));
    this.states.rs.y = this._normalizeAxis(data.getUint8(3));
    this.states.l2 = this._normalizeAxis(data.getUint8(4));
    this.states.r2 = this._normalizeAxis(data.getUint8(5));

    //Touch
    const touch00 = data.getUint8(32);
    const touch01 = data.getUint8(33);
    const touch02 = data.getUint8(34);
    const touch03 = data.getUint8(35);
    const touch10 = data.getUint8(36);
    const touch11 = data.getUint8(37);
    const touch12 = data.getUint8(38);
    const touch13 = data.getUint8(39);
    this.states.touchpad.positions[0].active = !(touch00 & 0x80);
    this.states.touchpad.positions[0].x = ((touch02 & 0x0F) << 8) | touch01;
    this.states.touchpad.positions[0].y = (touch03 << 4) | ((touch02 & 0xF0) >> 4);
    this.states.touchpad.positions[1].active = !(touch10 & 0x80);
    this.states.touchpad.positions[1].x = ((touch12 & 0x0F) << 8) | touch11;
    this.states.touchpad.positions[1].y = (touch13 << 4) | ((touch12 & 0xF0) >> 4);

  }

  _normalizeAxis(value) {
    return ((2 * value / 0xFF) - 1.0).toFixed(2);
  }

  _toBool(number) {
    return (number ? 1.0 : 0.0) == 1;
  }

  updateOutputReport() {
    if (!this.isOutputBufferUpdated) {
      this.isOutputBufferUpdated = true;
    }
  }

  setLightBarColor(red, green, blue) {
    this.outputReportBuffer[44] = red;
    this.outputReportBuffer[45] = green;
    this.outputReportBuffer[46] = blue;
    this.updateOutputReport();
  }
  
  setPlayerNumber(number) {
    if (number == 1) {
      this.outputReportBuffer[43] = 4;
    } else if (number == 2) {
      this.outputReportBuffer[43] = 2;
    } else if (number == 3) {
      this.outputReportBuffer[43] = 5;
    } else if (number == 4) {
      this.outputReportBuffer[43] = 3;
    } else {
      this.outputReportBuffer[43] = 0;
    }
    this.updateOutputReport();
  }


  setMuteButtonLed(state) {
    this.outputReportBuffer[8] = state;
    this.updateOutputReport();
  }

  setTrigger(triggerConfig) {
    if (triggerConfig.selectedTrigger == this.triggers.left | triggerConfig.selectedTrigger == this.triggers.both) {
      this.outputReportBuffer[10] = triggerConfig.mode;
      this.outputReportBuffer[11] = triggerConfig.forces[0];
      this.outputReportBuffer[12] = triggerConfig.forces[1];
      this.outputReportBuffer[13] = triggerConfig.forces[2];
      this.outputReportBuffer[14] = triggerConfig.forces[3];
      this.outputReportBuffer[15] = triggerConfig.forces[4];
      this.outputReportBuffer[16] = triggerConfig.forces[5];
      this.outputReportBuffer[17] = triggerConfig.forces[6];
    }
    if (triggerConfig.selectedTrigger == this.triggers.right | triggerConfig.selectedTrigger == this.triggers.both) {
      this.outputReportBuffer[21] = triggerConfig.mode;
      this.outputReportBuffer[22] = triggerConfig.forces[0];
      this.outputReportBuffer[23] = triggerConfig.forces[1];
      this.outputReportBuffer[24] = triggerConfig.forces[2];
      this.outputReportBuffer[25] = triggerConfig.forces[3];
      this.outputReportBuffer[26] = triggerConfig.forces[4];
      this.outputReportBuffer[27] = triggerConfig.forces[5];
      this.outputReportBuffer[28] = triggerConfig.forces[6];
    }
    this.updateOutputReport();
  }

  setHeavyMotor(intensity) {
    this.outputReportBuffer[3] = intensity;
    this.updateOutputReport();
  }

  setSoftMotor(intensity)  {
    this.outputReportBuffer[2] = intensity;
    this.updateOutputReport();
  }

  setHeavyMotorByDuration(intensity, duration) {
    this.outputReportBuffer[3] = intensity;
    this.updateOutputReport();
    if (duration > 0) {
      setTimeout(() => {
        this.outputReportBuffer[3] = 0x00;
        this.updateOutputReport();
      }, duration);
    }
  }

  setSoftMotorByDuration(intensity, duration) {
    this.outputReportBuffer[2] = intensity;
    this.updateOutputReport();
    if (duration > 0) {
      setTimeout(() => {
        this.outputReportBuffer[2] = 0x00;
        this.updateOutputReport();
      }, duration);
    }
  }


  muteButtonLedState = {
    off: 0x00,
    on: 0x01,
    pulse: 0x02
  };

  triggers = {
    left: 0,
    right: 1,
    both: 2
  };

  states = {
    connectionState: '',
    triangle: false,
    circle: false,
    square: false,
    cross: false,
    share: false,
    option: false,
    dpadUp: false,
    dpadDown: false,
    dpadLeft: false,
    dpadRight: false,
    ps: false,
    mute: false,
    l3: false,
    r3: false,
    l1: false,
    r1: false,
    l2: 0,
    r2: 0,
    ls: {
      x: 0,
      y: 0
    },
    rs: {
      x: 0,
      y: 0
    },
    touchpad: {
      pressed: false,

      positions: [
        {
          active: false,
          x: 0,
          y: 0
        },
        {
          active: false,
          y: 0,
          x: 0
        }
      ]

    },
    accel: [0, 0, 0],
    gyro: [0, 0, 0]
  };
}