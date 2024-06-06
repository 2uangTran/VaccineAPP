package com.kthp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader
import com.kthp.PayZaloBridge

import vn.zalopay.sdk.Environment
import vn.zalopay.sdk.ZaloPaySDK
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            packages.add(PayZaloBridge())
            return packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }

    // Implement the reactNativeHost property
    override val reactNativeHost: ReactNativeHost
        get() = mReactNativeHost

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        ZaloPaySDK.init(2554, Environment.SANDBOX)
    }
}
