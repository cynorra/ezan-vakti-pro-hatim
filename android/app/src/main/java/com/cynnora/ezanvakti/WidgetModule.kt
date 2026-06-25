package com.cynnora.ezanvakti

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetModule"
    }

    @ReactMethod
    fun setNextPrayer(name: String, time: String) {
        val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val editor = prefs.edit()
        editor.putString("next_prayer_name", name)
        editor.putString("next_prayer_time", time)
        editor.apply()

        val context = reactApplicationContext
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, PrayerWidgetProvider::class.java))
        for (id in ids) {
            PrayerWidgetProvider.updateAppWidget(context, appWidgetManager, id)
        }
    }
}
