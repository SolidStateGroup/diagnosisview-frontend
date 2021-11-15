import BottomSheet from 'react-native-bottomsheet';
import firebase from 'react-native-firebase';
const _data = require('../../../common/stores/base/_data');

const FCM = firebase.messaging();
const analytics = firebase.analytics();
analytics.setAnalyticsCollectionEnabled(!Project.debug);
const Notifications = firebase.notifications();

const channel = new firebase.notifications.Android.Channel('dv-channel', 'DiagnosisView Channel', firebase.notifications.Android.Importance.Default)
  .setDescription('DiagnosisView Channel');

Notifications.android.createChannel(channel);

var PushManager = class {
    static token = null;
    static onNotification = null;
    getInitialNotification = () => Notifications.getInitialNotification();

    subscribe = (topic) => {
        return FCM.subscribeToTopic(topic);
    }
    unsubscribe = (topic) => {
        return FCM.unsubscribeFromTopic(topic);
    }
    stop = () => {
        this.token = null;
        this.notificationListener = null;
    } // remove old listener
    init = (onNotification, silent) => {

        this.onNotification = onNotification;

        if (!this.notificationListener) {
            FCM.onMessage((notification) => {
                if (this.notificationListener)
                    this.notificationListener(notification)
                notification.finish();
            })
        }

        this.notificationListener = (notification) => {
            //Callback if notification is valid

            if (notification._notificationType == "will_present_notification")
                return //these notifications are duplicate and pointless

            this.onNotification && this.onNotification(Object.assign({}, notification, {fromClick: notification._notificationType == "notification_response"}))
        }

        if (this.token) {
            return Promise.resolve(this.token);
        }

        return new Promise((resolve, reject) => {
            if (!silent) {
                FCM.requestPermission(); // for iOS
            }

            FCM.getToken().then(token => {
                if (token) {
                    this.token = token;
                    resolve(this.token);
                }
                // store fcm token in your server
            });


            this.refreshTokenListener = FCM.onTokenRefresh((token) => {
                if (token) {
                    this.token = token;
                    resolve(this.token);
                }
                // fcm token may not be available on first load, catch it here
            });
        });
    }
    showLocalNotification = (id, title, body, data) => {
        const notification = new firebase.notifications.Notification()
            .setNotificationId(id)
            .setTitle(title)
            .setBody(body)
            .android.setChannelId('dv-channel')
            .setData(data || {});

        Notifications.displayNotification(notification);
    }
    scheduleLocalNotification = (id, title, body, data, fireDate) => {
        const notification = new firebase.notifications.Notification()
            .setNotificationId(id)
            .setTitle(title)
            .setBody(body)
            .android.setChannelId('dv-channel')
            .setData(data || {});

        Notifications.scheduleNotification(notification, { fireDate });
    }
    cancelAllNotifications = () => {
        Notifications.cancelAllNotifications()
            .catch(e => console.log('Error cancelling all pending notifications', e));
    }
};
var push = new PushManager();

global.API = {

    isMobile: true,

    log: function () {

    },

    trackEvent: function (data) {
        if (analytics) {
            const {event, ...rest} = data;
            if (!data) {
                console.error("Passed null event data")
            }
            console.info("track", data);
            if (!data || !data.category || !data.event) {
                console.error("Invalid event provided", data);
            }

            analytics.logEvent(event.toLowerCase().replace(/ /g, "_"), rest)

        }

    },
    trackPage: function (name) {
        if (analytics) {
            analytics.setCurrentScreen(name, name)
        }
    },
    share: (uri, message, title, subject, excludedActivityTypes, type) => {
        ReactNative.Share.share({message, title, url: uri}, {subject, excludedActivityTypes})
    },
    showOptions: (title, options, cancelButton = true, dark = true) => {
        return new Promise((resolve) => {
            cancelButton && options.push("Cancel");
            BottomSheet.showBottomSheetWithOptions({
                options,
                title,
                dark,
                cancelButtonIndex: cancelButton && options.length - 1,
            }, (value) => {
                resolve(value);
            });
        })
    },
    getContacts: (includePhotos) => {
        if (typeof Contacts == "undefined")
            alert("You need to link react-native-contacts to use this function");
        return Promise.resolve([]);
        includePhotos ?
            new Promise((resolve) => Contacts.getAll((error, contacts) => resolve({
                error,
                contacts: contacts && contacts.map(parseContact)
            })))
            : new Promise((resolve) => Contacts.getAllWithoutPhotos((error, contacts) => resolve({
                error,
                contacts: contacts && contacts.map(parseContact)
            })))
    },
    showUpload: (title, multiple, width, height, compressImageQuality = 0.8, onStart) => {
        return new Promise((resolve) => {
            API.showOptions(title, ["Camera", "Upload a Photo"]).then((i) => {
                if (typeof ImagePicker == "undefined")
                    alert("You need to link react-native-image-picker to use this function")
                //todo : handle multiple
                if (i == 0 || i == 1) {
                    const options = {
                        cropping: width || height ? true : false,
                        multiple,
                        width,
                        height,
                        compressImageQuality
                    };

                    const func = i ? ImagePicker.openPicker : ImagePicker.openCamera

                    return func(options)
                        .then(({path}) => {
                            onStart && onStart(path);

                            resolve({path})

                        });
                }
            })
        })
    },

    generateLink: (title, metadata, $fallback_url) => {
        return branch.createBranchUniversalObject("share", {
            title,
            metadata
        }).then((branchUniversalObject) => {
            let controlParams = {};
            return branchUniversalObject.generateShortUrl({}, controlParams)
                .then(({url}) => url);
        });
    },
    getInitialLink: (cb) => {
        initialLinkCb = cb;
        return initialLink ? cb(link) : null;
    },
    push,
    finalisePurchases: () => {

        RNIap.initConnection().then(()=>{
            Platform.select({android:RNIap.getPurchaseHistory,ios:RNIap.getPurchaseHistory})().then((res)=>{
                if (res[0] && res[0].purchaseToken) {
                    RNIap.acknowledgePurchaseAndroid(res[0].purchaseToken)
                    return
                }
                const receipt = res[0] && res[0].transactionReceipt
                    ? res[0].transactionReceipt
                    : res[0] && res[0].originalJson;
                if (receipt) {
                    RNIap.finishTransaction(receipt)
                        .then((r)=>{
                        })
                        .catch((v)=>{
                        })
                }
            })
        })

    },
    validateReceipt: async (receipt, originalPurchase) => {
        const isTestApp = DeviceInfo.getBundleId().indexOf('test') !== -1;
let result;
        if (Platform.OS === "ios") {
            result = await RNIap.validateReceiptIos({
                'receipt-data': receipt,
                password: isTestApp ? '9f8e85c251bb4d6094c9f630b94be9b3' : undefined
            }, false)
            if (result.status !== 0) {
                result = await RNIap.validateReceiptIos({
                    'receipt-data': receipt,
                    password: isTestApp ? '9f8e85c251bb4d6094c9f630b94be9b3' : undefined
                }, true)
            }
        } else {
            try {
                result = await _data.post(`${Project.api}user/validate/android/public`, { packageName: DeviceInfo.getBundleId(), productId: iapItemSkus[0], purchaseToken: receipt });
            } catch (e) {
                // console.log(e);
                result = false;
            }
        }


        if (Platform.OS === 'ios') {
            if (result.status !== 0) {
                if (result.status === 21007 || result.status === 21008 || result.status=== 21003) {
                    alert(result.status)
                }
                return;
            }
            const sortedReceipts = _.sortBy(result.receipt.in_app, ({purchase_date_ms}) => -purchase_date_ms);
            const latestReceipt = sortedReceipts && sortedReceipts.length && sortedReceipts[0];
            if (!latestReceipt) {
                console.log('Latest receipt could not be determined.')
                return;
            }
            const expiryDate = moment(parseInt(latestReceipt.purchase_date_ms)).add(1, result.receipt.receipt_type.toLowerCase().includes('sandbox') ? 'hour' : 'year');
            // if (expiryDate.isSameOrBefore(moment())) {
            //     console.log('Receipt has expired.')
            //     return;
            // }
            AppActions.setSubscription({autoRenewing: false, expiryDate, result, receipt});
            AsyncStorage.setItem('transactionReceipt', receipt);
        } else {
            if (!result) return;
            const expiryDate = moment(parseInt(result.expiryTimeMillis));
            const autoRenewing = result.autoRenewing;
            // if (expiryDate.isSameOrBefore(moment())) {
            //     console.log('Receipt has expired.')
            //     return;
            // }
            AppActions.setSubscription({autoRenewing, expiryDate, result, receipt});
            AsyncStorage.setItem('transactionReceipt', receipt);
        }
        return true;
    }
};


var linkCb = null;
var initialLinkCb = null;
var link = null;
var checkedInitialLink = null;
var initialLink = null;
// import branch from 'react-native-branch';
//
//
// branch.subscribe(({error, params}) => {
//     if (error) {
//         console.error('Error from Branch: ' + error)
//         return
//     }
//
//     if (params['+clicked_branch_link']) {
//
//         link = params;
//
//         if (!checkedInitialLink) {
//             initialLink = params;
//             if (initialLinkCb)
//                 initialLinkCb(params)
//         }
//
//         if (linkCb) {
//             linkCb(params)
//         }
//
//     }
//     checkedInitialLink = true;
// });
