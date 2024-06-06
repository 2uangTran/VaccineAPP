// MainActivity.kt
package com.kthp

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

import vn.zalopay.sdk.Environment
import vn.zalopay.sdk.ZaloPaySDK

class MainActivity : ReactActivity(), DefaultHardwareBackBtnHandler {

    override fun getMainComponentName(): String {
        return "KTHP"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun onCreate(savedInstanceState: Bundle?) {
                super.onCreate(savedInstanceState)
                // Initialize ZaloPaySDK with appID and environment
                ZaloPaySDK.init(2554, Environment.SANDBOX)
            }

            override fun onBackPressed(): Boolean {
                val deviceEventEmitter = reactInstanceManager.currentReactContext
                    ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                deviceEventEmitter?.emit("onBackPressed", null)
                return super.onBackPressed()
            }
        }
    }
}
