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

const METRICA_API_KEY = 'fa026b7c-3462-419e-8e57-8c08493289f4';

const LandingScreen = ({ setIsAccepted }: Props) => {
    const [url, setUrl] = useState<string>('');
    const webViewRef = useRef<WebView | null>(null)

    const codeAddListener = useMemo(() => {
        return `
                const init = async () => {
                   window.ReactNativeWebView.postMessage(JSON.stringify({ log_action: 'Listener injected'}));
                 
                   window.addEventListener("message", function (event) {
                        window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
                   });
                   document.addEventListener("click", function (event) {
                       const fileInputs = document.querySelectorAll('.edit-profile__photo input[type="file"]');
                       if(fileInputs?.length) {
                           fileInputs.forEach((fileInput) => {
                               const fn = () => {
                                   window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'upload_photo'}));
                                   removeEventListener("change", fn);
                               }
                               fileInput.addEventListener("change", fn);
                           });
                       }
                   });
                };
                init();
    `;
    }, []);

    const addMetricaAction = (action: string) => {
        try {
            console.log('METRICA_ACTION: ', action)
            AppMetrica.reportEvent(action);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        AppMetrica.activate({
            apiKey: METRICA_API_KEY,
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
            ref={webViewRef}
            style={styles.container}
            source={{ uri: url }}
            scalesPageToFit={(Platform.OS !== 'ios')}
            onNavigationStateChange={(data) => {
                try {
                    saveLastUrl(data.url)
                    dailyNotification()
                } catch (e) {
                    console.error('onNavigationStateChange error:', e);
                }
            }}
            onMessage={ (event) => {
                try {
                    if(event.nativeEvent?.data) {
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