import sensor from '@system.sensor';

const MAX_SCORE = 10000;

export default {
    data: {
        countDownStarted: false,
        countDownNumber: 3,
        x: 0,
        y: 0,
        z: 0,
        sqrt: 0,
        score: 0,
        highestScore: 0,
        previousScore: 0,
        threshold: 30,
        punchInProgress: false
    },
    onInit() {
        this.title = "Hello World";
    },
    onStartClick() {
        this.countDownStarted = true;
        var intervalId = setInterval(() => {
            this.countDownNumber--;
            if (this.countDownNumber == 0) {
                sensor.subscribeAccelerometer({
                    interval: 'game',
                    success: ret => {
                        console.log('X-axis data: ' + ret.x);
                        console.log('Y-axis data: ' + ret.y);
                        console.log('Z-axis data: ' + ret.z);
                        this.x = ret.x;
                        this.y = ret.y;
                        this.z = ret.z;
                        this.sqrt = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
                        this.score = ((this.sqrt - this.threshold) * MAX_SCORE) / 10;
                        console.log('sqrt: ' + this.sqrt);
                        console.log('score: ' + this.score);
                        // Update highestScore
                        if(this.sqrt > this.highestScore && this.sqrt > this.threshold) {
                            this.punchInProgress = true;
                            this.highestScore = this.score.toFixed(0);
                        }
                        // Unregister listener if the score starts dropping (peak has been reached)
                        if(this.punchInProgress && this.score < this.previousScore) {
                            this.score = this.previousScore;
                            this.punchInProgress = false;
                            sensor.unsubscribeAccelerometer();
                        }
                        this.previousScore = this.score;
                    },
                    fail: (data, code) => {
                        console.error('Subscription failed. Code: ' + code + '; data: ' + data);
                    }
                });
                clearInterval(intervalId);
            }
        }, 1000);
    },

    onDestroy() {

    }
}
