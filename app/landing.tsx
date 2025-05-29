import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import {ActivityIndicator, Platform, StyleSheet} from 'react-native';
import {useEffect, useMemo, useRef, useState} from 'react';
import AppMetrica from "@appmetrica/react-native-analytics";
import {getLastUrl, saveLastUrl} from "@/utils/storage";
import {dailyNotification} from "@/utils/notifications";
interface Props {
    setIsAccepted: (isAccepted: boolean) => void;
}

const LandingScreen = ({ setIsAccepted }: Props) => {
    const [url, setUrl] = useState<string>('');
    const webViewRef = useRef<WebView | null>(null)

    const codeAddListener = useMemo(() => {
        return `
            setTimeout(() => {
                const init = async () => {
                   console.log("Listener injected");
                   let fileInputs = null;
                   window.addEventListener("message", function (event) {
                        window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
                   });
                   document.addEventListener("click", function (event) {
                       console.log("Document clicked");
                       if(fileInputs?.length) {
                           fileInputs.forEach((fileInput) => {
                               const fn = () => {
                                   window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'upload_photo'}));
                               }
                               fileInput.addEventListener("change", fn);
                           });
                       } else {
                           fileInputs = document.querySelectorAll('.edit-profile__photo input[type="file"]');
                       }
                   });
                };
                init();
            }, 2000);
    `;
    }, []);

    const addMetricaAction = (action: string) => async () => {
        try {
            AppMetrica.reportEvent(action);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        AppMetrica.activate({
            apiKey: '',
            sessionTimeout: 120,
            firstActivationAsUpdate: false,
            locationTracking: true,
            logs: true
        });
        getLastUrl()
            .then(res => {
                if(res) {
                    setUrl(res);
                } else {
                    setUrl(res);
                }
            })
            .catch(res => {
                setUrl(res);
            });
        if(webViewRef.current) {
            webViewRef?.current.reload();
        }
        return () => {
            if (webViewRef?.current) {
                webViewRef.current.reload();
            }
        }
    }, []);


    if(!url) {
        return <ActivityIndicator size={'large'}/>
    }

    return (
        <WebView
            bounces={false}
            ref={(ref) => (webViewRef.current = ref)}
            style={styles.container}
            source={{ uri: url }}
            scalesPageToFit={(Platform.OS !== 'ios')}
            onNavigationStateChange={(data) => {
                try {
                    saveLastUrl(data.url)
                } catch (e) {
                    console.error('onNavigationStateChange error:', e);
                }
            }}
            onMessage={ (event) => {
                try {
                    if(event.nativeEvent?.data) {
                        dailyNotification()
                        const data = JSON.parse(event.nativeEvent?.data)
                        if(data && data?.action === 'upload_photo') {
                            addMetricaAction('upload_photo')
                        }
                        if(data && data.penpal) {
                            if(data.args[0]) {
                                if(data.args[0].status === 'success') {
                                    addMetricaAction('prem_start')
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('onMessage error:', e);
                }
            }}
            onOpenWindow={(event) => {
                console.log(event)
            }}
            onHttpError={(event) => {
                console.log('Error:',event)
                saveLastUrl()
                setIsAccepted(false);
            }}
            onError={(event) => {
                console.log('Error:',event)
                saveLastUrl()
                setIsAccepted(false);
            }}
            javaScriptCanOpenWindowsAutomatically={true}
            originWhitelist={['*']}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            automaticallyAdjustContentInsets={false}
            injectedJavaScript={codeAddListener}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: Constants.statusBarHeight,
    },
});

export default LandingScreen;