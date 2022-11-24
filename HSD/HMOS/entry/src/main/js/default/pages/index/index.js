import router from '@system.router'
import { P2pClient, Message, Builder, PeerDeviceClient } from '../wearengine.js'


var p2pClient;
const peerPkgName = "com.mo55.test.wearengine";
const peerFingerprint = "1B94EE283FA8A9321D19927D728DE360A7BC210724C1992221383B55622A2974";

export default {
    data: {
        title: ""
    },

    onInit() {
        this.title = this.$t('strings.world');
        p2pClient = new P2pClient();
        p2pClient.setPeerPkgName(peerPkgName);
        p2pClient.setPeerFingerPrint(peerFingerprint);
    },
    onDestroy() {
//        p2pClient.unregisterReceiver({
//            onSuccess: () => {
//                console.log("Unregistered p2pClient");
//            },
//            onFailure: () => {
//                console.log("Failed to unregister p2pClient");
//            }
//        });
    },
    onPunchButtonClick() {
        router.push({
            uri: 'pages/punch/punch'
//            uri: 'pages/animation/animation'
        });
    },
    onHeartRateButtonClick() {
        router.push({
            uri: 'pages/heart/heart'
        });
    },
    onGetPeerDeviceButtonClick() {
        var peerDeviceClient = new PeerDeviceClient();
        peerDeviceClient.getPeerDevice({
            onSuccess: data => {
                console.log('getPeerDevice data: ' + data);
                console.log('getPeerDevice JSON data: ' + JSON.stringify(data));
            },
            onFailure: data => {
                console.log('getPeerDevice failure data: ' + data);
                console.log('getPeerDevice failure data: ' + JSON.stringify(data));
            }
        }

        );
    },
    onPing() {
        p2pClient.ping({
            onSuccess: () => {
                console.log("Ping success");
            },
            onFailure: () => {
                console.log("Ping fail");
            },
            onPingResult: resultCode => {
                console.log("Ping result: " + resultCode);
            }
        })
    },
    onSendMessageClick() {
        var builderClient = new Builder();
        var messageStr = "Hello";
        builderClient.setDescription(messageStr);
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
    }
}
