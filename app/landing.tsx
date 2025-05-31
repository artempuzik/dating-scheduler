import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import {ActivityIndicator, Platform, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useEffect, useMemo, useRef, useState} from 'react';
import AppMetrica from "@appmetrica/react-native-analytics";
import {getLastUrl, saveLastUrl} from "@/utils/storage";
import {dailyNotification} from "@/utils/notifications";
import React from 'react';

interface Props {
    setIsAccepted: (isAccepted: boolean) => void;
}

const METRICA_API_KEY = 'fa026b7c-3462-419e-8e57-8c08493289f4';

const LandingScreen = ({ setIsAccepted }: Props) => {
    const [url, setUrl] = useState<string>('');
    const [checkoutIsOpen, setCheckoutIsOpen] = useState<boolean>(false);
    const webViewRef = useRef<WebView | null>(null)

    const codeAddListener = useMemo(() => {
        return `
        setTimeout(() => {
            const init = async () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({log_action: 'Listener injected'}));

                // Override the fetch function
                const originalFetch = window.fetch;
                window.fetch = async function(url, options) {
                    try {
                        const response = await originalFetch.apply(this, arguments);
                        const responseData = await response.text();
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            action: 'network_response',
                            data: {
                                url: url,
                                status: response.status,
                                response: responseData,
                            }
                        }));

                        return new Response(responseData, response);
                    } catch (error) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            action: 'network_error',
                            data: {
                                url: url,
                                error: error.message
                            }
                        }));
                        throw error;
                    }
                };

                // Override XMLHttpRequest
                const originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;

                    xhr.open = function(method, url) {
                        this._url = url;
                        this._method = method;
                        return originalOpen.apply(this, arguments);
                    };

                    xhr.send = function(body) {
  
                        this.addEventListener('load', function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                action: 'network_response',
                                data: {
                                    url: this._url,
                                    status: this.status,
                                    response: this.responseText,
                                    headers: this.getAllResponseHeaders()
                                }
                            }));
                        });

                        this.addEventListener('error', function() {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                action: 'network_error',
                                data: {
                                    url: this._url,
                                    status: this.status,
                                    response: this.responseText
                                }
                            }));
                        });

                        return originalSend.apply(this, arguments);
                    };

                    return xhr;
                };

                window.addEventListener('message', function(event) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        action: 'message',
                        data: event.data
                    }));
                });

                document.addEventListener("click", function (event) {
                    const fileInputs = document.querySelectorAll('.edit-profile__photo input[type="file"]');
                    if(fileInputs?.length) {
                        fileInputs.forEach((fileInput) => {
                            const fn = () => {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                                    action: 'upload_photo'
                                }));
                                removeEventListener("change", fn);
                            }
                            fileInput.addEventListener("change", fn);
                        });
                    }
                });
            };
            init();
        }, 2000);
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
        <>
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

                            if(data && data.action === 'network_response') {
                                if(data.data.url.includes('/api/premium/checkout')) {
                                    console.log(data.data);
                                    setCheckoutIsOpen(true)
                                }
                                if(data.data.url.includes('/api/check-premium')) {
                                    console.log(data.data);
                                    if (checkoutIsOpen) {
                                        addMetricaAction('prem_start')
                                        setCheckoutIsOpen(false)
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error('onMessage error:', e);
                    }
                }}
                onOpenWindow={(event) => {
                    console.log(event.nativeEvent)
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
                allowFileAccess={true}
                automaticallyAdjustContentInsets={false}
                injectedJavaScript={codeAddListener}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: Constants.statusBarHeight,
    },
    testButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    testButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default LandingScreen;