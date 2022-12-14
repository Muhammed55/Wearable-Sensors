package com.mo55.test.wearengine.extensions

import com.huawei.wearengine.auth.AuthCallback
import com.huawei.wearengine.auth.AuthClient
import com.huawei.wearengine.auth.Permission
import kotlinx.coroutines.isActive
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

suspend fun AuthClient.suspendRequestPermission(permission : Permission) = suspendCoroutine<Unit> { cont ->
    requestPermission(object : AuthCallback {
        override fun onOk(granted: Array<out Permission>) {
            if(cont.context.isActive) {
                val notGranted = granted.filter { g -> permission.name == g.name }
                if (notGranted.isEmpty()) {
                    cont.resume(Unit)
                } else {
                    cont.resumeWithException(PermissionException("Not all permissions granted! Not granted: ${notGranted.joinToString { it.name }}"))
                }
            }
        }

        override fun onCancel() {
            if(cont.context.isActive) {
                cont.resumeWithException(PermissionException("Permission request canceled by user!"))
            }
        }
    }, permission).addOnCompleteListener { task ->
        if(!task.isSuccessful && cont.context.isActive) {
            cont.resumeWithException(TaskException("Request permission task was not successful", task.exception))
        }
    }
}

private class PermissionException(message: String) : RuntimeException(message)