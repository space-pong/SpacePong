// This should be added inside the DualSense class in your JavaScript file

async connectAndRumbleLeftMotor() {
  try {
      await this.requestDevice(); // Make sure the device is connected
      this.output.motorLeft = 255; // Set left motor to maximum rumble
      this.output.motorRight = 0; // Ensure the right motor is off
      await this.sendOutputReport(); // Send the output report to the controller
  } catch (error) {
      console.error('Failed to rumble left motor:', error);
  }
}
