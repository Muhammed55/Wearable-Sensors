import animator from '@ohos.animator';

// xxx.js
export default {
    data: {
        title: "",
        playState: "running",
        myFontSize: 20,
        animator: null
    },
    onInit() {
        var options = {
            duration: 1500,
            easing: 'friction',
            fill: 'forwards',
            iterations: 2,
            begin: 20.0,
            end: 100.0
        };
        this.animator = animator.createAnimator(options);
    },
    toggleState() {
        var options1 = {
            duration: 2000,
            easing: 'friction',
            fill: 'forwards',
            iterations: 1,
            begin: 20.0,
            end: 100.0
        };
        if (this.playState ===  "running") {
            this.animator.update(options1);
            this.animator.onframe = value => {
                this.myFontSize = value;
            }
            this.animator.play();
            this.playState = "paused";
        } else {
            this.playState = "running";
        }
    }
}