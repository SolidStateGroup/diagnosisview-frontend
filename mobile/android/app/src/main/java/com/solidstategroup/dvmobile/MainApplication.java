//STANDARD REACT_NATIVE STUFF
package com.solidstategroup.dvmobile;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.dooboolab.RNIap.RNIapPackage;
import com.clipsub.rnbottomsheet.RNBottomSheetPackage;
import com.wix.interactable.Interactable;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

//REAT_NATIVE_NAVIGATION
 import com.reactnativenavigation.NavigationApplication;
import android.support.annotation.Nullable;


//REACT_NATIVE_BRANCH
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;

//REACT_NATIVE_CRASHLYTICS
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

//REACT_NATIVE_FIREBASE
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- Add this line
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // <-- Add this line
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line

import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

//REACT_NATIVE_LOTTIE
import com.airbnb.android.react.lottie.LottiePackage;

//VECTOR_ICONS
import com.oblador.vectoricons.VectorIconsPackage;

//REACT_NATIVE_DEVICE_INFO
import com.learnium.RNDeviceInfo.RNDeviceInfo;

// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;

import com.entria.views.RNViewOverflowPackage;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
           return Arrays.<ReactPackage>asList(
                                 new RNBottomSheetPackage(),
                                 new Interactable(),

                               //REACT_NATIVE_FIRE_BASE
                                   new RNFirebasePackage(),
                                   new RNFirebaseMessagingPackage(),
                                   new RNFirebaseAnalyticsPackage(),
                                   new RNFirebaseNotificationsPackage(),
                               //END OF REACT_NATIVE_FIRE_BASE

                               new FabricPackage(),
                               new LottiePackage(),
                               new VectorIconsPackage(),
                               new RNDeviceInfo(true),
                               new RNBranchPackage(),
                               new RNIapPackage(),
                               new LinearGradientPackage(),
                               new RNViewOverflowPackage()
                        );
    }

    @Override public
    String getJSMainModuleName() { return "index"; }


 @Override
  public void onCreate() {
        super.onCreate();
        Branch.getAutoInstance(this);
  }

}