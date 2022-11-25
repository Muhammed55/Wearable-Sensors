import sensor from '@system.sensor';

export default {
    data: {
        light: "",
        bodyState: ""
    },
    onInit() {
        sensor.subscribeLight({
            success: ret => {
                this.light = ret.intensity;
                console.log("Light: " + JSON.stringify(ret));
            },
            fail: (data, code) => {
                console.log("Failed to subscribe to proximity sensor: " + data + " " + code);
            }
        });
        sensor.subscribeOnBodyState({
            success: ret => {
                this.bodyState = ret.value;
                console.log("BodyOnState: " + JSON.stringify(ret));
            },
            fail: (data, code) => {
                console.log("Failed to subscribe to onBodyState sensor: " + data + " " + code);
            }
        });
    },

    onDestroy() {
        sensor.unsubscribeLight();
        sensor.unsubscribeOnBodyState();
    }
}
