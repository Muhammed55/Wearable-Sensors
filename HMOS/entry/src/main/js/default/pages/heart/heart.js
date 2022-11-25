import sensor from '@system.sensor';
import { P2pClient, Message, Builder, PeerDeviceClient } from '../wearengine.js'


var p2pClient;
const peerPkgName = "com.mo55.test.wearengine";
const peerFingerprint = "1B94EE283FA8A9321D19927D728DE360A7BC210724C1992221383B55622A2974";


export default {
    data: {
        heartRate: 0,
        time: '00:00:00'
    },
    onInit() {
        setInterval(() => {
            var today = new Date();
            this.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        }, 1000);

        p2pClient = new P2pClient();
        p2pClient.setPeerPkgName(peerPkgName);
        p2pClient.setPeerFingerPrint(peerFingerprint);

        sensor.subscribeHeartRate({
            success: ret => {
                console.log('get heartrate value:' + ret.heartRate);
                this.heartRate = ret.heartRate;
                this.sendMessage(ret.heartRate);
            },
            fail: (data, code) => {
                console.log('Subscription failed. Code: ' + code + '; Data: ' + data);
            },
        });

    },

    sendMessage(heartRate) {
        var builderClient = new Builder();
        var messageStr = "Hello";
        builderClient.setDescription(heartRate);
        var message = new Message();
        message.builder = builderClient;
        p2pClient.send(message, {
            onSuccess: () => {
                console.log("Message sent successfully");
            },
            onFailure: () => {
                console.log("Message sending failed")
            },
            onSendResult: result => {
                console.log("Message sending code: " + result.code + " data: " + result.data);
            }
        });
    },
    onDestroy() {
        sensor.unsubscribeHeartRate();
//        p2pClient.unregisterReceiver({
//            onSuccess: () => {
//                console.log("Unregistered p2pClient");
//            },
//            onFailure: () => {
//                console.log("Failed to unregister p2pClient");
//            }
//        });
    },


}
