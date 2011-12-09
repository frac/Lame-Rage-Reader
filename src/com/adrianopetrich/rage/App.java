package com.adrianopetrich.rage;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.phonegap.DroidGap;

public class App extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        WebSettings settings = this.appView.getSettings(); 
        settings.setSupportZoom(true); 
        settings.setBuiltInZoomControls(true); 
    }
}
