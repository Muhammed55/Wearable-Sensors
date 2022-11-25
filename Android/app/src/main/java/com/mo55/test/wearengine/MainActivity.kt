package com.mo55.test.wearengine

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import com.huawei.hmf.tasks.OnFailureListener
import com.huawei.hmf.tasks.OnSuccessListener
import com.huawei.wearengine.HiWear
import com.huawei.wearengine.auth.AuthClient
import com.huawei.wearengine.auth.Permission
import com.huawei.wearengine.device.DeviceClient
import com.huawei.wearengine.p2p.Message
import com.huawei.wearengine.p2p.P2pClient
import com.huawei.wearengine.p2p.PingCallback
import com.huawei.wearengine.p2p.Receiver
import com.mo55.test.wearengine.extensions.await
import com.mo55.test.wearengine.extensions.suspendRequestPermission
import kotlinx.coroutines.*
import org.json.JSONObject
import org.json.JSONTokener

const val PEER_PKG_NAME = "com.mo55.test.wearenginehos"
const val PEER_FINGERPRINT = "com.mo55.test.wearenginehos_BHORyHFEWyjx77Ql8/8u6Ef8UNyKpdjqogd5k6aDWkU+i7la+Qy6JylRh9uFzonOQB2sqtCvnpxj2Fvuk1B8W2M="

class MainActivity : AppCompatActivity() {

    private lateinit var deviceClient : DeviceClient
    private lateinit var authClient : AuthClient
    private lateinit var p2pClient : P2pClient

    private lateinit var heartRateTextView : TextView
    private lateinit var connectionStatusTextView : TextView
    private lateinit var pingButton : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        deviceClient = HiWear.getDeviceClient(applicationContext)
        authClient  = HiWear.getAuthClient(applicationContext)
        p2pClient  = HiWear.getP2pClient(applicationContext)
        checkConditions()

        heartRateTextView = findViewById(R.id.heartRateTextView)
        connectionStatusTextView = findViewById(R.id.connectionStatusTextView)
        pingButton = findViewById(R.id.pingButton)

        pingButton.setOnClickListener {
            lifecycleScope.launch {
                val devices = deviceClient.bondedDevices.await()
                devices.first { it.isConnected }?.let {
                    p2pClient.ping(it, PingCallback {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Ping status: $it", Toast.LENGTH_LONG).show()
                        }
                    })
                }
            }
        }
    }

    private fun checkConditions() {
        lifecycleScope.launch {
            val hasAvailableDevices = deviceClient.hasAvailableDevices().await()
            if(!hasAvailableDevices) {
                Toast.makeText(this@MainActivity, "No wearable devices available", Toast.LENGTH_LONG).show();
                return@launch
            }
            val grantedPermission = authClient.checkPermission(Permission.DEVICE_MANAGER).await()
            if(!grantedPermission) {
                AlertDialog.Builder(this@MainActivity)
                    .setMessage("")
                    .setCancelable(false)
                    .setPositiveButton("Grant permission") { _, _ ->
                        lifecycleScope.launch {
                            authClient.suspendRequestPermission(Permission.DEVICE_MANAGER)
                            registerReceiverToDevice()
                        }
                    }
            } else {
                registerReceiverToDevice()
            }
        }
    }

    private fun pingWatch() {

    }

    private var receiver = ReceiverImpl()


    private suspend fun registerReceiverToDevice() {

        val devices = deviceClient.bondedDevices.await()
        if (devices.isNullOrEmpty()) {
            return
        }

        devices.first { it.isConnected }?.let {
            runOnUiThread {
                connectionStatusTextView.text = "Connceted to " + it.name
            }
            val isAppInstalled = p2pClient.isAppInstalled(it, PEER_PKG_NAME).await()
            p2pClient.setPeerPkgName(PEER_PKG_NAME)
            p2pClient.setPeerFingerPrint(PEER_FINGERPRINT)
            if(isAppInstalled) {
                p2pClient.registerReceiver(it, ReceiverImpl()).await()
            }
        }
    }

    private inner class ReceiverImpl : Receiver {
        override fun onReceiveMessage(m: Message) {
            runOnUiThread {
                if(m.type == Message.MESSAGE_TYPE_DATA) {
                    try {
                        val jsonObject = JSONTokener(String(m.data)).nextValue() as JSONObject
                        if(jsonObject.has("heartRate")) {
                            heartRateTextView.text = jsonObject.getString("heartRate");
                        }
                    } catch (e : Exception) {
                        Log.d("MainActivity", "Could not parse message: ${e.message}");
                    }
                }
            }
        }

    }

}