# Huawei Wearables Sensors and Wear Engine Demo

This demo project shows how to make use of several different sensors on a Huawei wearable app and how to send the data from the sensors to an Android app. The project consists of an Android 
and HarmonyOS app (Wearable app). 

### Android
The Android app has integrated the Huawei Wear Engine and is thereby able to obtain messages sent from the wearable app. The collected data is just shown in the Android app.
The project is written in Kotlin.

### HarmonyOS (HMOS)
The HarmonyOS app is responsible for obtaining data through its sensors, such as the user's heart rate, and sending it to the Android app. 
All code is written in Javascript, HML and CSS. 

#### Demo



| Watch 3 - P40 Lite |
| ------ |
| ![Demo GIF](https://github.com/Muhammed55/Wearable-Sensors/blob/main/Screenshots/Watch3.gif) |

## Installation and Setup

### Android
Get the latest [Android Studio](https://developer.android.com/studio) version to build the Android project.

### HarmonyOS
Get the latest [DevEco Studio](https://developer.harmonyos.com/en/develop/deveco-studio) version to build the HarmonyOS project.
Apply for wearengine in Huawei Developer Console, configure signing and bundle name of HarmonyOS project. 
Refer to [official documentation](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/service-introduction-0000000000018585)
for details on how to do it. 
