import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  NativeModules,
} from 'react-native';
import RNFS, {TemporaryDirectoryPath} from 'react-native-fs';
import {select} from './PathSelector';

const App = () => {
  const [videoPath, setVodeoPath] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [log, setLog] = useState('');

  const handleVideoSelect = () => {
    select()
      .then((path: string) => {
        setVodeoPath(path);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleTargetPathSelect = () => {
    select(false, true)
      .then((path: string) => {
        setTargetPath(path);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const executeScript = () => {
    const {uri} = Image.resolveAssetSource(require('./node/index.txt'));
    if (uri) {
      const fromUrl = uri;
      const toFile = `${TemporaryDirectoryPath}/node.js`;
      const {promise} = RNFS.downloadFile({fromUrl, toFile});
      promise.then(() => {
        NativeModules.RNPathSelector.execute(
          toFile,
          videoPath,
          targetPath,
          (output: string) => {
            setLog(output);
          },
        );
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <Button title="选择视频" onPress={handleVideoSelect} />
          <Text style={styles.content}>{videoPath}</Text>
        </View>

        <View>
          <Button title="选择目标路径" onPress={handleTargetPathSelect} />
          <Text style={styles.content}>{targetPath}</Text>
        </View>

        <Button title="执行脚本" onPress={executeScript} />
        <Text style={styles.log}>{log}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  log: {
    marginTop: 32,
    alignSelf: 'center',
  },
});

export default App;
