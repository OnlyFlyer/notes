# React Native 源码解读


`Clone with SSH`: **`git@github.com:facebook/react-native.git`**


`Clone with HTTPS`: **`https://github.com/facebook/react-native.git`**

以上两种方式都可 `Clone` 源码, 研究 React Native 源码一方面是为了 `论文`, 与此相关, 另一方面是想搞清楚 React Native 的移动端实现原理.

一. `Clone` 下来的文件夹里面现先看了一下 `README.md` 文件, 罗列几点:

1. Learn once, write anywhere(学习一次, 随时随地去写)

2. Supported operating system are `>= Android 4.1(API 16)` and `>= IOS 8.0`(支持的操作系统: >= Android4.1 API 16 和 IOS 8.0)

3. Build native mobile apps using `JavaScript` and `React`; A `React Native App` is a **real** `mobile app`; Don't waste time recompiling; Use native code when you need to(使用 `JavaScript` 和 `React` 构建原生移动 App; `React Native App` 是真正的移动应用程序; 不用浪费时间去重编译; 当你需要的时候页还可以使用 `原生代码` )

4. Another great way to learn more about the components and APIs included with React Native is to read their source, Look under the `Libraries/Components` directory for components like **ScrollView** and **TextInput**(了解更多关于 `React Native` 的 `组件` 和 `API` 的方法是 读它的源码, 在 `Libraries/Components` 文件夹下有像 `ScrollView` 和 `TextInput` 的组件)

二. `大致` 浏览了 `package.json` 文件, 了解 `React Native` 包的入口文件是 `Libraries/react-native/react-native-implementation.js`

![](./img/entry.png)

`react-native-implementation.js` 中都是引入的包文件, 分为 `五个部分`:
1. `Components` (组件).
    - 里面包含了所有的 `RN` 组件, 有: `AccessibilityInfo`, `ActivityIndicator`, `ART`, `Button`, `CheckBox`, `DatePickerIOS`, `DrawerLayoutAndroid`, `FlatList`, `Image`, `ImageBackground`, `ImageEditor`, `ImageStore`, `KeyboardAvoidingView`, `ListView`, `MaskedViewIOS`, `Modal`, `NavigatorIOS`, `Picker`, `PickerIOS`, `ProgressBarAndroid`, `ProgressBarIOS`, `SafeAreaView`, `ScrollView`, `SectionList`, `SegmentedControlIOS`, `Slider`, `SnapShotViewIOS`, `Switch`, `RefreshControl`, `StatusBar`, `SwipeableFlatList`, `SwipeableListView`, `TabBarIOS`, `Text`, `TextInput`, `ToastAndroid`, `ToolbarAndroid`, `Touchable`, `TouchableHighlight`, `TouchableNativeFeedback`, `TouchableOpacity`, `TouchableWithoutFeedback`, `View`, `ViewPagerAndroid`, `VirtualizedList`, `WebView`
2. `APIs` (API).Application Programing Interface
    - 包含了所有的API, 有: `ActionSheetIOS`, `Alert`, `AlertIOS`, `Animated`, `AppRegistry`, `AppState`, `AsyncStorage`, `BackAndroid`, `BackHandler`, `CameraRoll`, `Clipboard`, `DatePickerAndroid`, `DeviceInfo`, `Dimensions`, `Easing`, `findNodeHandle`, `I18nManager`, `ImagePickerIOS`, `InteractionManager`, `Keyboard`, `LayoutAnimation`, `Linking`, `NativeEventEmitter`, `NetInfo`, `PanResponder`, `PermissionsAndroid`, `PixelRatio`, `PushNotificationIOS`, `Settings`, `Share`, `StatusBarIOS`, `StyleSheet`, `Systrace`, `TimePickerAndroid`, `TVEventHandle`, `UIManager`, `unstable_batchedUpdates`, `Vibration`, `VibrationIOS`, `YellowBox`
3. `Plugins`(插件).
    - 包含一些常用的插件, 有: `DeviceEventEmitter`, `NativeAppEventEmitter`, `NativeModules`, `Platform`, `processColor`, `requireNativeComponent`, `takeSnapShot`
4. `Prop Types`(类型校验).
    - 包含一些常用的类型校验包, 有: `ColorPropType`, `EdgeInsetsPropType`, `PointPropType`, `ViewPropTypes`
5. `deprecated`(已经弃用).
    - 有: `Navigator`

换句话说: `React Native` 的所有点都列在上面, 想要研究透 `RN` , 上面的必须看明白, 接下来的重点就是看上面的 `Components`, `APIs`, `Plugins`, `Prop Types` ..