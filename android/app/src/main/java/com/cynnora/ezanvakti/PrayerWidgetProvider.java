package com.cynnora.ezanvakti;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class PrayerWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE);
        String nextPrayerName = prefs.getString("next_prayer_name", "Ezan Vakti");
        String nextPrayerTime = prefs.getString("next_prayer_time", "--:--");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_prayer);
        views.setTextViewText(R.id.widget_title, nextPrayerName);
        views.setTextViewText(R.id.widget_time, nextPrayerTime);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
