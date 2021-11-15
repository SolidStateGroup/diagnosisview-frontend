/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//Standard RN
#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

//REACT_NATIVE_BRANCH
//#import <react-native-branch/RNBranch.h>

//REACT_NATIVE_FABRIC
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

//REACT_NATIVE_FIREBASE
#import <Firebase.h>
#import "RNFirebaseNotifications.h"

//REACT_NATIVE_NAVIGATION
#import "RCCManager.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  //REACT_NATIVE_BRANCH
//  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this

  //REACT_NATIVE_FABRIC
 // [Fabric with:@[[Crashlytics class]]];

  //REACT_NATIVE_FUREBASE
  [FIRApp configure];
  [RNFirebaseNotifications configure];

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@" %@", name);
    }
  }

  //REACT_NATIVE_NAVIGATION
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

  
  // Facebook/Google/Branch.io URL handling
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
//  if ([RNBranch.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]) {
//    return YES;
//  }
//    if( [url.absoluteString rangeOfString: @"com.googleusercontent.apps" ].location != NSNotFound ) {
//      return [[GIDSignIn sharedInstance] handleURL:url sourceApplication:sourceApplication annotation:annotation];
//    }
//
//    return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation];
//  }
    
    
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}
  
@end
