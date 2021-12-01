//STANDARD REACT_NATIVE STUFF
package com.solidstategroup.dvmobile;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.dooboolab.RNIap.RNIapPackage;
import com.clipsub.rnbottomsheet.RNBottomSheetPackage;
// import com.wix.interactable.Interactable;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

//REAT_NATIVE_NAVIGATION
 import com.reactnativenavigation.NavigationApplication;


//REACT_NATIVE_BRANCH
// import io.branch.rnbranch.RNBranchPackage;
// import io.branch.rnbranch.RNBranchModule;

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

import com.facebook.react.ReactInstanceManager;

// Add CodePush imports
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class MainApplication extends NavigationApplication implements ReactInstanceHolder {

	@Override
	public boolean isDebug() {
		// Make sure you are using BuildConfig from your own application
		return BuildConfig.DEBUG;
	}

	protected List<ReactPackage> getPackages() {
		// Add additional packages you require here
		return Arrays.<ReactPackage>asList(
			new CodePush("deployment-key-here", getApplicationContext(), BuildConfig.DEBUG),
			 new RNBottomSheetPackage(),
            //                                  new Interactable(),

               //REACT_NATIVE_FIRE_BASE
                   new RNCWebViewPackage(),
                   new RNFirebasePackage(),
                   new RNFirebaseMessagingPackage(),
                   new RNFirebaseAnalyticsPackage(),
                   new RNFirebaseNotificationsPackage(),
               //END OF REACT_NATIVE_FIRE_BASE

               new FabricPackage(),
               new LottiePackage(),
               new VectorIconsPackage(),
               new RNDeviceInfo(),
//                new RNBranchPackage(),
               new RNIapPackage(),
               new LinearGradientPackage(),
               new RNViewOverflowPackage()
		);
	}

	@Override
	public List<ReactPackage> createAdditionalReactPackages() {
		return getPackages();
	}

	@Override
	public String getJSBundleFile() {
        // Override default getJSBundleFile method with the one CodePush is providing
		return CodePush.getJSBundleFile();
	}

	@Override
	public String getJSMainModuleName() {
		return "index";
	}

    @Override
    public ReactInstanceManager getReactInstanceManager() {
        // CodePush must be told how to find React Native instance
        return getReactNativeHost().getReactInstanceManager();
    }

 @Override
  public void onCreate() {
        super.onCreate();
//         RNBranchModule.getAutoInstance(this);
  }

}
