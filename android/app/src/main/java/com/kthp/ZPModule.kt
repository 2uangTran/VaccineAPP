package com.kthp

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log


import vn.zalopay.sdk.ZaloPaySDK
import vn.zalopay.sdk.listeners.PayOrderListener
import vn.zalopay.sdk.ZaloPayError

class ZPModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val PAYMENTSUCCESS = "1"
    private val PAYMENTFAILED = "-1"
    private val PAYMENTCANCELED = "4"

    private val listener = object : PayOrderListener {
        override fun onPaymentSucceeded(transactionId: String, transToken: String, appTransID: String) {
            val params = Arguments.createMap()
            params.putString("transactionId", transactionId)
            params.putString("transToken", transToken)
            params.putString("appTransID", appTransID)
            params.putString("returnCode", PAYMENTSUCCESS)
            sendEvent("EventPayZalo", params)

             Log.d("ZaloPay", "Payment succeeded - Transaction ID: $transactionId, App Trans ID: $appTransID")
        }

        override fun onPaymentCanceled(transToken: String, appTransID: String) {
            val params = Arguments.createMap()
            params.putString("returnCode", PAYMENTCANCELED)
            params.putString("zpTranstoken", transToken)
            params.putString("appTransID", appTransID)
            sendEvent("EventPayZalo", params)
        }

        override fun onPaymentError(zaloPayError: ZaloPayError, transToken: String, appTransID: String) {
            val params = Arguments.createMap()
            params.putString("returnCode", PAYMENTFAILED)
            params.putString("zpTranstoken", transToken)
            params.putString("appTransID", appTransID)
            sendEvent("EventPayZalo", params)
        }
    }

    override fun getName(): String {
        return "PayZaloBridge"
    }

    @ReactMethod
    fun payOrder(zpTransToken: String) {
        val currentActivity: Activity? = currentActivity
        if (currentActivity != null) {
            ZaloPaySDK.getInstance().payOrder(currentActivity, zpTransToken, "demozpdk://app", listener)
        } else {
            // Handle null activity context
            val params = Arguments.createMap()
            params.putString("error", "Activity context is null")
            sendEvent("EventPayZalo", params)
        }
    }

    @ReactMethod
    fun installApp() {
        ZaloPaySDK.getInstance().navigateToZaloOnStore(reactApplicationContext)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
