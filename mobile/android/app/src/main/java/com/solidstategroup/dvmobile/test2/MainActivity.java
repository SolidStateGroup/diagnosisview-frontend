package com.solidstategroup.dvmobile.test2;

import com.reactnativenavigation.controllers.SplashActivity;
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this

 public class MainActivity extends SplashActivity {
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);
    }
}
